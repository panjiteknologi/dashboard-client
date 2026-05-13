import { NextRequest, NextResponse } from 'next/server';
import { TSI_STANDARDS } from '@/lib/scope-formatter';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

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

2. After gathering enough business activity information, write a WELL-FORMATTED response using this exact structure:

   **[Judul singkat tentang industri mereka]**

   Paragraf 1 (2-3 kalimat): Jelaskan bidang usaha pengguna dan mengapa sertifikasi penting untuk industri mereka.

   **Sertifikasi yang relevan:**
   • **[Nama Standar 1]** — [1 kalimat alasan mengapa relevan]
   • **[Nama Standar 2]** — [1 kalimat alasan mengapa relevan]
   • (tambahkan jika ada yang relevan)

   Kalimat penutup singkat yang mengalir ke hasil pencarian scope. (contoh: "Berikut hasil pencarian scope sertifikasi yang tersedia di PT TSI untuk bisnis Anda:")

   THEN immediately after (no blank line), output:
   KEYWORDS:<keyword1>,<keyword2>,<keyword3>
   SUMMARY:<complete business description in 1-2 sentences>
   LANG:IDN

   FORMATTING RULES:
   - Use **bold** for standard names (ISO 9001, HACCP, etc.) and section headers
   - Use bullet points (•) for listing standards
   - Keep each bullet concise — max 1 sentence
   - The closing sentence must naturally lead into the scope results shown below it
   - Only mention standards from the PT TSI available list above
   - Adapt language (IDN/EN) to match user's language

3. If already 2 Q&A rounds, MUST conclude with explanation + KEYWORDS/SUMMARY/LANG now.
${mustConclude && !hasShownResults ? '\n⚠️ MANDATORY: Write formatted explanation then output KEYWORDS, SUMMARY, and LANG right now.' : ''}
${hasShownResults ? `
4. Scope results have already been shown. Continue the conversation naturally:
   - Answer confirmation or clarification questions about the found scope
   - If user wants a different scope, output new KEYWORDS/SUMMARY/LANG
   - Do NOT show numbered choices for follow-ups, just answer directly` : ''}`;

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

      // Return AI text immediately + scope search info — frontend will fetch scope separately
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
