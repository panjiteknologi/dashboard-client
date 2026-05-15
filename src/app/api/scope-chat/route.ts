import { NextRequest, NextResponse } from 'next/server';
import scopeTSI from '@/lib/scope_tsi.json';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

async function callAI(
  systemPrompt: string,
  messages: ChatMessage[],
  maxTokens = 1200
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
      temperature: 0.4,
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

function buildTSICatalog(): string {
  type ScopeRef = Record<string, unknown>;
  const ref = scopeTSI.scope_reference as ScopeRef;
  const lines: string[] = [];

  for (const [std, entry] of Object.entries(ref)) {
    if (Array.isArray(entry)) {
      const scopes = entry as Array<{ iaf_code: number; scope: string; nace_codes: string[] }>;
      lines.push(`\n**${std}** (NACE-based, multi-industry):`);
      scopes.forEach(s => lines.push(`  IAF ${s.iaf_code}: ${s.scope} — NACE: ${s.nace_codes.join(', ')}`));
    } else {
      const e = entry as { description?: string; scopes?: Array<{ scope: string; code?: string }> };
      lines.push(`\n**${std}**:`);
      if (e.description) lines.push(`  ${e.description}`);
      if (e.scopes && e.scopes.length > 0) {
        e.scopes.forEach(s => lines.push(`  • ${s.scope}${s.code ? ` (code: ${s.code})` : ''}`));
      } else {
        lines.push(`  (Berlaku universal untuk semua organisasi)`);
      }
    }
  }

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

    const hasShownResults = messages.some(
      (m) => m.role === 'assistant' && m.content.includes('NACE') && m.content.includes('IAF')
    );

    const tsiCatalog = buildTSICatalog();

    const systemPrompt = `Kamu adalah AI Assistant milik PT TSI (TSI Sertifikasi Internasional), lembaga sertifikasi di Indonesia.

Kamu adalah AI yang GENERATIF dan FLEKSIBEL. Kamu BOLEH menjawab pertanyaan apapun dari user — baik tentang sertifikasi, bisnis, pengetahuan umum, maupun topik lainnya. Jawab secara alami seperti asisten AI cerdas.

## KATALOG PRODUK/STANDAR PT TSI:
${tsiCatalog}

---

## CARA MENGAMBIL KEPUTUSAN:

### Jika user bertanya tentang produk/standar/scope PT TSI:
→ Jawab LANGSUNG dari katalog di atas. Tampilkan daftar, jelaskan standar, bandingkan scope — sesuai kebutuhan user. JANGAN tanya balik.

### Jika user mendeskripsikan bisnis/industri mereka:
→ Langsung analisis dan cari scope yang sesuai. JANGAN tanya-tanya lagi jika sudah cukup informasi.
→ Jika benar-benar tidak jelas, boleh tanya SATU pertanyaan singkat saja.
→ Setelah tahu scope-nya, output KEYWORDS dan SUMMARY di akhir pesan (lihat format di bawah).

### Jika user bertanya hal umum di luar sertifikasi:
→ Jawab secara natural dan helpful, layaknya chat AI biasa. Kamu boleh menjawab.

### Jika user minta tampilkan/daftar/list produk TSI atau standar yang dimiliki:
→ Tampilkan katalog lengkap dari data di atas. LANGSUNG tampilkan, jangan tanya balik.

---

## FORMAT TRIGGER PENCARIAN SCOPE:
Gunakan format ini DI AKHIR pesanmu ketika kamu sudah tahu bisnis/industri user dan ingin memicu pencarian scope detail:

KEYWORDS:<kata kunci 1>,<kata kunci 2>,<kata kunci 3>
SUMMARY:<deskripsi singkat bisnis user dalam 1-2 kalimat>
LANG:IDN

(Ganti LANG:IDN dengan LANG:EN jika user menulis dalam bahasa Inggris)

---

## ATURAN BAHASA:
- Deteksi bahasa user secara otomatis (Indonesia atau Inggris)
- Balas dalam bahasa yang SAMA dengan user
- Tag KEYWORDS/SUMMARY/LANG harus tetap ada meski user pakai bahasa Inggris

---

## ATURAN PENTING:
- JANGAN selalu tanya balik — putuskan sendiri apa yang user butuhkan
- JANGAN sebut standar yang tidak ada di katalog PT TSI (jangan karang-karang)
- Jika user tanya standar yang tidak ada di katalog (misal ISO 50001), jelaskan PT TSI belum punya akreditasi untuk itu
- Boleh pakai **bold**, bullet point, dan formatting markdown
- Jawaban harus natural, to the point, dan tidak bertele-tele
${hasShownResults ? `\n## KONTEKS: Hasil scope sudah ditampilkan sebelumnya. Lanjutkan percakapan secara natural. Jika user minta scope berbeda, output KEYWORDS/SUMMARY baru.` : ''}`;

    const aiText = await callAI(systemPrompt, messages);

    const keywordsMatch = aiText.match(/KEYWORDS:([^\n\r]+)/i);
    const summaryMatch = aiText.match(/SUMMARY:([^\n\r]+)/i);
    const langMatch = aiText.match(/LANG:(IDN|EN)/i);

    const responseLang = (langMatch?.[1]?.toUpperCase() as 'IDN' | 'EN') ?? 'IDN';

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

      return NextResponse.json({
        phase: 'asking',
        chat_message: conversationMessage,
        scope_query: { query: searchQuery, lang: responseLang },
        keywords_used: keywords,
      });
    }

    return NextResponse.json({ phase: 'asking', chat_message: aiText });
  } catch (error) {
    console.error('Scope Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
