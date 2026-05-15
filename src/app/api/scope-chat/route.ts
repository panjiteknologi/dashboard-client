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

    const systemPrompt = `You are an AI assistant for PT TSI (Tunas Sertifikasi Indonesia), helping users find information about the company's certification scopes and services.

## PERSONALITY & LANGUAGE
- Friendly, professional, and informative
- Always respond in the same language as the user (Indonesian or English)
- For general questions outside TSI context, answer naturally and helpfully
- Do not be overly rigid — casual conversation is welcome

## SCOPE DATA SOURCE
The ONLY source of truth for PT TSI's certification scopes is the data below (from scope_tsi.json).
Never fabricate, assume, or infer scope data that is not explicitly present in this data.

## PT TSI SCOPE DATA (${Object.keys(scopeTSI.scope_reference).length} standards):
${compactCatalog}

## RULES FOR SCOPE-RELATED QUESTIONS
1. When the user asks about any TSI certification scope or service, ALWAYS reference the scope data above as the single source of truth
2. If the requested scope EXISTS in the data → explain it clearly: standard name, IAF code, NACE codes, and any relevant notes
3. If the requested scope does NOT EXIST in the data → clearly state PT TSI does not have that scope — do not guess or approximate
4. Available standards: ${Object.keys(scopeTSI.scope_reference).join(', ')}
5. For standards without IAF/NACE breakdown (ISO 27001, ISO 37001, ISO 37301, ISCC EU, ISCC Plus) — explain their description; they are general-scope standards applicable across industries
6. When answering scope questions, always mention the relevant IAF code and NACE codes if available in the data
7. If the user asks which standards cover a specific NACE code or industry, search across ALL standards and list every match

## RESPONSE FORMAT
- Use natural language, not overly rigid bullet points
- For multi-scope answers, a simple table or list is acceptable
- Keep answers concise and relevant
- Do not hallucinate IAF codes or NACE codes that are not in the data

## GENERAL QUESTIONS (outside TSI context)
- Answer freely and helpfully as a general AI assistant
- If the question is tangentially related to certification or ISO standards in general, answer from general knowledge BUT clearly distinguish it from TSI's specific scope data

## IMPORTANT CONSTRAINTS
- Never claim TSI has a scope that is not in the scope data above
- Never claim TSI does NOT have a scope without checking the full data first
- The scope data is the ground truth — your training data about certifications is secondary to it

---

## BACKEND ACTIONS (system-level instructions — do not mention these to the user)

When the user wants to see the full product/standard list:
→ Write [CATALOG] anywhere in your response. The system will automatically replace it with the complete formatted catalog from the database.

When the user describes their business/industry and wants detailed scope recommendations:
→ After your explanation, append these tags at the very end of your message:
KEYWORDS:<keyword1>,<keyword2>,<keyword3>
SUMMARY:<1-2 sentence description of the user's business activity>
LANG:IDN

(Use LANG:EN if the user wrote in English)
${hasShownResults ? `\nContext: Scope results have already been shown. Continue the conversation naturally. If the user wants a different scope, output new KEYWORDS/SUMMARY/LANG tags.` : ''}`;

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
