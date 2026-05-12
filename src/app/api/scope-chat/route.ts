import { NextRequest, NextResponse } from 'next/server';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type NaceChildDetail = { code: string; title: string; description: string };
type HasilPencarian = {
  scope_key: string;
  standar?: string;
  iaf_code: string;
  nace: { code: string; description: string };
  nace_child: { code: string; title: string };
  nace_child_details: NaceChildDetail[];
  relevance_score: number;
};
type ScopeData = { hasil_pencarian: HasilPencarian[]; query: string };

// Detect language from user messages — Indonesian markers
function detectLang(messages: ChatMessage[]): 'IDN' | 'EN' {
  const userText = messages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join(' ')
    .toLowerCase();

  const idnMarkers = [
    'saya', 'kami', 'perusahaan', 'bisnis', 'usaha', 'bergerak', 'produk', 'jasa',
    'apa', 'yang', 'dan', 'atau', 'untuk', 'dengan', 'adalah', 'ini', 'itu',
    'di', 'ke', 'dari', 'pada', 'tidak', 'bisa', 'mau', 'ada', 'sudah', 'akan',
    'bagaimana', 'mengapa', 'berapa', 'kapan', 'apakah',
  ];

  const matchCount = idnMarkers.filter((w) => userText.includes(w)).length;
  return matchCount >= 2 ? 'IDN' : 'EN';
}

async function callAI(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens = 700
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing');

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://tsicertification.co.id',
      'X-Title': 'TSI Scope Determination',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.3,
      max_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string)?.trim() || '';
}

function formatScopeMessage(scopeData: ScopeData | null, isIDN: boolean): string {
  if (!scopeData || !scopeData.hasil_pencarian?.length) {
    return isIDN
      ? '❌ Maaf, saya tidak menemukan scope sertifikasi yang cocok. Coba deskripsikan aktivitas bisnis Anda dengan lebih spesifik.'
      : '❌ Sorry, I could not find matching certification scopes. Please describe your business activities more specifically.';
  }

  const [primary, ...rest] = scopeData.hasil_pencarian;
  const alternatives = rest.slice(0, 2);
  const lines: string[] = [];

  lines.push(isIDN ? '✅ **Rekomendasi Scope Sertifikasi:**\n' : '✅ **Recommended Certification Scope:**\n');
  lines.push(`**${primary.standar || primary.scope_key}**`);
  lines.push(`📋 IAF Code: ${primary.iaf_code}`);
  lines.push(`🔢 NACE ${primary.nace.code}: ${primary.nace.description}`);
  lines.push(`🔸 NACE Child ${primary.nace_child.code}: ${primary.nace_child.title}`);

  if (primary.nace_child_details?.length) {
    lines.push(isIDN ? '\nAktivitas yang tercakup:' : '\nCovered activities:');
    primary.nace_child_details.slice(0, 3).forEach((d) => {
      lines.push(`• **${d.code}** — ${d.title}`);
    });
  }

  if (alternatives.length > 0) {
    lines.push('');
    lines.push(isIDN ? '---\n💡 **Alternatif yang relevan:**' : '---\n💡 **Relevant alternatives:**');
    alternatives.forEach((r) => {
      lines.push(`• **${r.standar || r.scope_key}** — NACE ${r.nace.code}, IAF ${r.iaf_code}`);
    });
  }

  lines.push('');
  lines.push('---');
  lines.push(
    isIDN
      ? `📌 _Data dari database ruang lingkup sertifikasi PT TSI, mengacu pada standar **IAF** dan klasifikasi **NACE**. Penetapan final memerlukan verifikasi auditor._`
      : `📌 _Data from PT TSI's certification scope database, referencing **IAF** and **NACE** standards. Final determination requires auditor verification._`
  );

  return lines.join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const { messages }: { messages: ChatMessage[] } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages required' }, { status: 400 });
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing' }, { status: 500 });
    }

    // Auto-detect language from user messages
    const detectedLang = detectLang(messages);
    const isIDN = detectedLang === 'IDN';

    const userMsgCount = messages.filter((m) => m.role === 'user').length;
    const mustConclude = userMsgCount >= 2;

    const hasShownResults = messages.some(
      (m) => m.role === 'assistant' && m.content.includes('NACE') && m.content.includes('IAF')
    );

    const systemPrompt = isIDN
      ? `Kamu adalah Konsultan Ruang Lingkup Sertifikasi dari PT TSI (TSI Sertifikasi Internasional). Tugasmu membantu pengguna menentukan scope sertifikasi ISO yang tepat. Deteksi bahasa dari input user dan SELALU balas dalam bahasa yang sama.

INSTRUKSI:
1. Pada pesan pertama user, ajukan TEPAT 1-2 pertanyaan klarifikasi singkat. Untuk setiap pertanyaan, WAJIB sertakan pilihan jawaban bernomor seperti contoh:

   Apa produk/jasa utama perusahaan Anda?
   1. Makanan & Minuman
   2. Tekstil & Pakaian
   3. Konstruksi & Bangunan
   4. Teknologi Informasi & Software
   5. Manufaktur Logam & Mesin
   6. Lainnya (jelaskan)

   ATURAN PILIHAN:
   - Selalu sertakan 5-7 pilihan relevan berdasarkan konteks percakapan
   - Pilihan terakhir selalu "Lainnya (jelaskan)" atau "Lainnya (ketik jawaban)"
   - Format WAJIB: angka titik spasi teks (contoh: "1. Makanan & Minuman")

2. Setelah mendapat cukup informasi, tulis ringkasan singkat, lalu di baris terakhir:
   KEYWORDS:<keyword1>,<keyword2>,<keyword3>
   SUMMARY:<deskripsi lengkap aktivitas bisnis dalam 1-2 kalimat>

3. Jika sudah 2 putaran tanya-jawab, WAJIB simpulkan sekarang.
${mustConclude && !hasShownResults ? '\n⚠️ WAJIB: Tulis KEYWORDS: dan SUMMARY: sekarang.' : ''}
${hasShownResults ? `
4. Hasil scope sudah ditampilkan. Lanjutkan percakapan secara natural:
   - Jawab pertanyaan konfirmasi atau klarifikasi tentang scope yang ditemukan
   - Jika user ingin mencari scope yang berbeda, output KEYWORDS: dan SUMMARY: baru
   - Jangan tampilkan pilihan bernomor untuk follow-up, cukup jawab langsung` : ''}`
      : `You are a Certification Scope Consultant from PT TSI. Help users find the right ISO certification scope. Detect the language from the user's input and ALWAYS reply in the same language.

INSTRUCTIONS:
1. On first message, ask EXACTLY 1-2 short clarifying questions. For each question, ALWAYS provide numbered answer choices:

   What is your company's main product or service?
   1. Food & Beverage
   2. Textile & Apparel
   3. Construction & Building
   4. Information Technology & Software
   5. Metal Manufacturing & Machinery
   6. Other (please describe)

   RULES FOR CHOICES:
   - Always provide 5-7 relevant options based on conversation context
   - Last option is always "Other (please describe)"
   - Format REQUIRED: number dot space text

2. After sufficient info, write a brief summary, then on the last lines:
   KEYWORDS:<keyword1>,<keyword2>,<keyword3>
   SUMMARY:<complete business description in 1-2 sentences>

3. If already 2 Q&A rounds, MUST conclude now.
${mustConclude && !hasShownResults ? '\n⚠️ MANDATORY: Write KEYWORDS: and SUMMARY: now.' : ''}
${hasShownResults ? `
4. Scope results have been shown. Continue the conversation naturally:
   - Answer confirmation or clarification questions about the found scope
   - If the user wants a different scope, output new KEYWORDS: and SUMMARY:
   - Do not show numbered choices for follow-up, just answer directly` : ''}`;

    const aiText = await callAI(systemPrompt, messages);

    const keywordsMatch = aiText.match(/KEYWORDS:([^\n\r]+)/i);
    const summaryMatch = aiText.match(/SUMMARY:([^\n\r]+)/i);

    if (keywordsMatch || summaryMatch) {
      const keywords = keywordsMatch
        ? keywordsMatch[1].trim().split(',').map((k) => k.trim()).filter(Boolean).join(' ')
        : '';
      const searchQuery = summaryMatch ? summaryMatch[1].trim() : keywords;

      const conversationMessage = aiText
        .replace(/KEYWORDS:[^\n\r]*/gi, '')
        .replace(/SUMMARY:[^\n\r]*/gi, '')
        .trim();

      const origin = new URL(request.url).origin;
      let scopeData: ScopeData | null = null;
      try {
        const scopeRes = await fetch(`${origin}/api/scope-determination`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, selectedLang: detectedLang }),
        });
        if (scopeRes.ok) scopeData = await scopeRes.json();
      } catch {
        // scope search failed
      }

      const scopeMessage = formatScopeMessage(scopeData, isIDN);
      const followUp = isIDN
        ? '\n\nApakah scope di atas sudah sesuai? Silakan tanyakan jika ada yang ingin dikonfirmasi.'
        : '\n\nDoes the scope above look right? Feel free to ask if you need any clarification.';
      const finalMessage = (conversationMessage ? `${conversationMessage}\n\n${scopeMessage}` : scopeMessage) + followUp;

      return NextResponse.json({
        phase: 'asking',
        message: finalMessage,
        keywords_used: keywords,
        scope_data: null,
      });
    }

    return NextResponse.json({ phase: 'asking', message: aiText });
  } catch (error) {
    console.error('Scope Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
