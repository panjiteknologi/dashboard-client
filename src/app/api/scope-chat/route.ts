import { NextRequest, NextResponse } from 'next/server';
import scopeTSI from '@/lib/scope_tsi.json';

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
type ScopeData = {
  hasil_pencarian: HasilPencarian[];
  query: string;
  penjelasan?: string;
  saran?: string;
};

const TSI_STANDARDS = Object.keys(scopeTSI.scope_reference);

async function callAI(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens = 700
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.OPENROUTER_FAST_MODEL || 'openai/gpt-4o-mini';

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
    const standardList = TSI_STANDARDS.map((s) => `• **${s}**`).join('\n');

    if (isIDN) {
      const aiExplanation = scopeData?.penjelasan
        ? `\n\n${scopeData.penjelasan.split('\n')[0]}`
        : '';
      return [
        `⚠️ **Scope Belum Tersedia di PT TSI**`,
        ``,
        `Berdasarkan informasi yang Anda berikan, saat ini **PT TSI belum memiliki akreditasi** untuk ruang lingkup sertifikasi tersebut.${aiExplanation}`,
        ``,
        `---`,
        `📋 **Standar yang tersedia di PT TSI saat ini:**`,
        standardList,
        ``,
        `---`,
        `💡 **Langkah yang dapat Anda lakukan:**`,
        `1. Periksa apakah aktivitas bisnis Anda masuk dalam salah satu standar di atas`,
        `2. Coba deskripsikan ulang dengan kata kunci yang berbeda`,
        `3. Hubungi tim PT TSI secara langsung untuk konsultasi lebih lanjut`,
        ``,
        `📌 _Ruang lingkup akreditasi PT TSI dapat berkembang seiring waktu. Untuk informasi terkini, silakan konfirmasi langsung ke PT TSI._`,
      ].join('\n');
    } else {
      const aiExplanation = scopeData?.penjelasan
        ? `\n\n${scopeData.penjelasan.split('\n')[0]}`
        : '';
      return [
        `⚠️ **Scope Not Yet Available at PT TSI**`,
        ``,
        `Based on the information you provided, **PT TSI does not currently hold accreditation** for that certification scope.${aiExplanation}`,
        ``,
        `---`,
        `📋 **Standards currently available at PT TSI:**`,
        standardList,
        ``,
        `---`,
        `💡 **Suggested next steps:**`,
        `1. Check if your business activities fall under one of the standards listed above`,
        `2. Try rephrasing your description with different keywords`,
        `3. Contact PT TSI directly for a consultation`,
        ``,
        `📌 _PT TSI's accreditation scope may expand over time. Please confirm directly with PT TSI for the latest information._`,
      ].join('\n');
    }
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

    const userMsgCount = messages.filter((m) => m.role === 'user').length;
    const mustConclude = userMsgCount >= 2;

    const hasShownResults = messages.some(
      (m) => m.role === 'assistant' && m.content.includes('NACE') && m.content.includes('IAF')
    );

    const tsiStandardList = TSI_STANDARDS.join(', ');

    const systemPrompt = `You are a Certification Scope Consultant from PT TSI (TSI Sertifikasi Internasional), a certification body in Indonesia.
Your job is to help users identify the correct certification scope, ONLY from standards that PT TSI holds accreditation for.

⚠️ PT TSI AVAILABLE STANDARDS:
${tsiStandardList}

ABSOLUTE RESTRICTIONS:
- NEVER recommend or mention any standard not in the list above
- NEVER fabricate standards (e.g. ISO 50001, ISO 31000, ISO 13485) if not in the list
- If asked about an unlisted standard, clearly state PT TSI does not hold that accreditation

LANGUAGE RULE:
- Automatically detect the language the user is writing in (Indonesian or English or other)
- Respond entirely in that same language
- When you output KEYWORDS/SUMMARY tags, you MUST also output a LANG tag: LANG:IDN (for Indonesian) or LANG:EN (for English/other)

CONVERSATION FLOW:
⛔ NEVER open with "which certification do you want?" — users often don't know which standard fits them. That's why they use this tool.

1. On the user's FIRST message, ask about their BUSINESS ACTIVITIES only:
   - What products do they manufacture or sell?
   - What services do they provide?
   - What industry or sector are they in?
   - What is their main production process or operational activity?

   Ask EXACTLY 1-2 short clarifying questions about business activities. For each question, provide numbered answer choices (5-7 options, last one always "Lainnya (jelaskan)" / "Other (describe)"):

   Example (Indonesian):
   Apa produk atau jasa utama dari perusahaan Anda?
   1. Produk Makanan & Minuman
   2. Jasa Konstruksi & Bangunan
   3. Layanan Teknologi Informasi & Software
   4. Produk Manufaktur (logam, mesin, elektronik)
   5. Produk Pertanian & Perkebunan
   6. Lainnya (jelaskan)

   CHOICE RULES:
   - Options must be about business activities/products/sectors — NOT about certifications or standards
   - Always provide 5-7 relevant options based on the context
   - Last option is always "Other (describe)" in the user's language
   - Format: number dot space text

2. After gathering enough business activity information, determine internally which PT TSI standard(s) might apply, write a brief summary, then output on separate lines:
   KEYWORDS:<keyword1>,<keyword2>,<keyword3>
   SUMMARY:<complete business description in 1-2 sentences>
   LANG:IDN

3. If already 2 Q&A rounds, MUST conclude with KEYWORDS/SUMMARY/LANG now.
${mustConclude && !hasShownResults ? '\n⚠️ MANDATORY: Output KEYWORDS, SUMMARY, and LANG right now.' : ''}
${hasShownResults ? `
4. Scope results have already been shown. Continue the conversation naturally:
   - Answer confirmation or clarification questions about the found scope
   - If user wants a different scope, output new KEYWORDS/SUMMARY/LANG
   - Do NOT show numbered choices for follow-ups, just answer directly` : ''}`;

    const aiText = await callAI(systemPrompt, messages);

    const keywordsMatch = aiText.match(/KEYWORDS:([^\n\r]+)/i);
    const summaryMatch = aiText.match(/SUMMARY:([^\n\r]+)/i);
    const langMatch = aiText.match(/LANG:(IDN|EN)/i);

    // AI-detected language; default to IDN (PT TSI's primary market)
    const responseLang = (langMatch?.[1]?.toUpperCase() as 'IDN' | 'EN') ?? 'IDN';
    const isIDN = responseLang === 'IDN';

    if (keywordsMatch || summaryMatch) {
      const keywords = keywordsMatch
        ? keywordsMatch[1].trim().split(',').map((k) => k.trim()).filter(Boolean).join(' ')
        : '';
      const searchQuery = summaryMatch ? summaryMatch[1].trim() : keywords;

      const conversationMessage = aiText
        .replace(/KEYWORDS:[^\n\r]*/gi, '')
        .replace(/SUMMARY:[^\n\r]*/gi, '')
        .replace(/LANG:[^\n\r]*/gi, '')
        .trim();

      const origin = new URL(request.url).origin;
      let scopeData: ScopeData | null = null;
      try {
        const scopeRes = await fetch(`${origin}/api/scope-determination`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery, selectedLang: responseLang }),
        });
        if (scopeRes.ok) scopeData = await scopeRes.json();
      } catch {
        // scope search failed — proceed without scope data
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
