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

function buildFullCatalogResponse(isIDN: boolean): string {
  type ScopeRef = Record<string, unknown>;
  const ref = scopeTSI.scope_reference as ScopeRef;
  const lines: string[] = [];

  lines.push(isIDN
    ? '📋 **Berikut seluruh produk/standar sertifikasi yang dimiliki PT TSI:**\n'
    : '📋 **Here are all certification products/standards held by PT TSI:**\n'
  );

  let index = 1;
  for (const [std, entry] of Object.entries(ref)) {
    lines.push(`**${index}. ${std}**`);

    if (Array.isArray(entry)) {
      const scopes = entry as Array<{ iaf_code: number; scope: string }>;
      scopes.forEach(s => lines.push(`   • IAF ${s.iaf_code}: ${s.scope}`));
    } else {
      const e = entry as { description?: string; scopes?: Array<{ scope: string; code?: string }> };
      if (e.description) lines.push(`   _${e.description}_`);
      if (e.scopes && e.scopes.length > 0) {
        e.scopes.forEach(s => lines.push(`   • ${s.scope}${s.code ? ` (${s.code})` : ''}`));
      } else {
        lines.push(isIDN ? `   _(Berlaku untuk semua organisasi)_` : `   _(Applicable to all organizations)_`);
      }
    }

    lines.push('');
    index++;
  }

  lines.push('---');
  lines.push(isIDN
    ? '💡 Ketik nama industri atau bidang usaha Anda untuk mencari scope sertifikasi yang paling sesuai.'
    : '💡 Type your industry or business activity to find the most suitable certification scope.'
  );

  return lines.join('\n');
}

function buildCompactCatalogForPrompt(): string {
  type ScopeRef = Record<string, unknown>;
  const ref = scopeTSI.scope_reference as ScopeRef;
  const lines: string[] = [];

  for (const [std, entry] of Object.entries(ref)) {
    if (Array.isArray(entry)) {
      const scopes = entry as Array<{ iaf_code: number; scope: string }>;
      lines.push(`${std}: ${scopes.map(s => `IAF${s.iaf_code}=${s.scope}`).join(' | ')}`);
    } else {
      const e = entry as { description?: string; scopes?: Array<{ scope: string; code?: string }> };
      const scopeList = e.scopes?.length ? e.scopes.map(s => s.scope).join(', ') : 'universal';
      lines.push(`${std}: ${e.description ?? scopeList}`);
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

    const compactCatalog = buildCompactCatalogForPrompt();

    const systemPrompt = `Kamu adalah AI Assistant milik PT TSI (TSI Sertifikasi Internasional), lembaga sertifikasi di Indonesia.

Kamu adalah AI yang GENERATIF dan FLEKSIBEL. Kamu BOLEH menjawab pertanyaan apapun dari user — baik tentang sertifikasi, bisnis, pengetahuan umum, maupun topik di luar konteks aplikasi. Jawab secara alami seperti asisten AI cerdas.

## KATALOG LENGKAP PRODUK PT TSI (${Object.keys(scopeTSI.scope_reference).length} standar):
${compactCatalog}

---

## CARA MENGAMBIL KEPUTUSAN:

Ketika user ingin melihat SEMUA produk/standar/daftar sertifikasi PT TSI secara lengkap:
→ Tulis [CATALOG] di dalam pesanmu. Sistem akan otomatis inject katalog lengkap yang akurat.
→ Kamu TIDAK perlu mengetik ulang daftarnya — cukup tulis [CATALOG].

Ketika user bertanya tentang standar tertentu atau penjelasan sertifikasi:
→ Jawab langsung dari pengetahuanmu berdasarkan katalog di atas.

Ketika user mendeskripsikan bisnis/industri mereka:
→ Langsung analisis. Jika sudah cukup info, output KEYWORDS + SUMMARY di akhir pesan.
→ Jika benar-benar ambigu, tanya SATU pertanyaan saja.

Ketika user bertanya hal umum di luar sertifikasi:
→ Jawab secara natural dan helpful. Kamu boleh menjawab topik apapun.

---

## TAG YANG BISA KAMU GUNAKAN:

**[CATALOG]** — tulis ini ketika kamu memutuskan perlu menampilkan seluruh daftar produk TSI. Backend akan inject data lengkap dari database secara otomatis.

**KEYWORDS/SUMMARY/LANG** — tulis di akhir pesan untuk memicu pencarian scope detail:
KEYWORDS:<kw1>,<kw2>,<kw3>
SUMMARY:<deskripsi bisnis user>
LANG:IDN

---

## ATURAN:
- Putuskan sendiri apa yang user butuhkan — JANGAN selalu tanya balik
- JANGAN sebut standar di luar katalog PT TSI
- Jika standar tidak ada di katalog, jelaskan PT TSI belum punya akreditasi tersebut
- Gunakan **bold**, bullet, markdown sesuai kebutuhan
- Jawaban natural, ringkas, tidak bertele-tele
- Balas dalam bahasa yang SAMA dengan user (IDN/EN)
${hasShownResults ? `\nKONTEKS: Hasil scope sudah ditampilkan. Lanjutkan percakapan natural. Jika user minta scope berbeda, output KEYWORDS/SUMMARY baru.` : ''}`;

    const aiText = await callAI(systemPrompt, messages);

    const langMatch = aiText.match(/LANG:(IDN|EN)/i);
    const responseLang = (langMatch?.[1]?.toUpperCase() as 'IDN' | 'EN') ?? 'IDN';

    // AI memutuskan tampilkan katalog lengkap — inject dari JSON, bukan dari output AI
    if (aiText.includes('[CATALOG]')) {
      const catalog = buildFullCatalogResponse(responseLang === 'IDN');
      const message = aiText.replace(/\[CATALOG\]/gi, catalog).replace(/LANG:[^\n\r]*/gi, '').trim();
      return NextResponse.json({ phase: 'asking', chat_message: message });
    }

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
