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

  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing');

  const models = [
    process.env.OPENROUTER_FAST_MODEL || 'openai/gpt-4o-mini',
    process.env.OPENROUTER_FALLBACK_MODEL || 'openai/gpt-oss-20b:free',
    'meta-llama/llama-3.3-70b-instruct:free',
    'deepseek/deepseek-r1:free',
    'qwen/qwen3-235b-a22b:free',
    'google/gemma-3-27b-it:free',
    'mistralai/mistral-small-3.2-24b-instruct:free',
  ];

  const doRequest = async (model: string) =>
    fetch(apiUrl, {
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

  let lastError = '';
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const res = await doRequest(model);
      if (res.ok) {
        if (i > 0) console.info(`[scope-chat] Using fallback model #${i}: ${model}`);
        const data = await res.json();
        return (data.choices?.[0]?.message?.content as string)?.trim() || '';
      }
      const errBody = await res.text().catch(() => '');
      lastError = `${res.status}: ${errBody.slice(0, 200)}`;
      if (res.status === 400 || res.status === 401) {
        throw new Error(`OpenRouter API error ${res.status}: ${errBody}`);
      }
      console.warn(`[scope-chat] Model ${model} failed (${res.status}), trying next...`);
    } catch (err) {
      if (err instanceof Error && (err.message.startsWith('OpenRouter API error 400') || err.message.startsWith('OpenRouter API error 401'))) throw err;
      lastError = err instanceof Error ? err.message : String(err);
      console.warn(`[scope-chat] Model ${model} threw error, trying next:`, lastError);
    }
  }

  throw new Error(`All models exhausted (last error: ${lastError}). Please try again later.`);
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

type FastGroupedResult = {
  scope_key: string;
  standar: string;
  iaf_code: string;
  nace: { code: string; description: string };
  nace_child: { code: string; title: string };
  nace_child_details: { code: string; title: string; description: string }[];
  relevance_score: number;
  scope_sentence_en?: string;
  scope_sentence_id?: string;
};

const IAF_SCOPE_ID: Record<string, string> = {
  'Agriculture, forestry and fishing': 'pertanian, kehutanan dan perikanan',
  'Mining and quarrying': 'pertambangan',
  'Food products, beverages and tobacco': 'produk makanan, minuman dan tembakau',
  'Textiles and textile products': 'tekstil dan produk tekstil',
  'Chemicals, chemical products and fibres': 'kimia, produk kimia dan serat',
  'Rubber and plastic products': 'karet dan produk plastik',
  'Concrete, cement, lime, plaster, etc.': 'beton, semen, kapur, plester, dll.',
  'Fabricated metal products': 'produk logam fabrikasi',
  'Machinery and equipment': 'mesin dan peralatan',
  'Electrical and optical equipment': 'peralatan listrik dan optik',
  'Other transport equipment': 'peralatan transportasi lainnya',
  'Manufacturing not elsewhere classified': 'manufaktur lainnya',
  'Construction': 'konstruksi',
  'Wholesale and retail trade; Repair of motor vehicles, motorcycles and personal and household goods': 'perdagangan besar dan eceran; perbaikan kendaraan bermotor dan barang keperluan rumah tangga',
  'Hotels and restaurants': 'hotel dan restoran',
  'Transport, storage and communication': 'transportasi, pergudangan dan komunikasi',
  'Financial intermediation; real estate; renting': 'intermediasi keuangan; real estat; persewaan',
  'Information technology': 'teknologi informasi',
  'Engineering services': 'layanan teknik',
  'Other services': 'layanan lainnya',
  'Public administration': 'administrasi publik',
  'Education': 'pendidikan',
};

type FastScopeResult = {
  hasil_pencarian: FastGroupedResult[];
  penjelasan: string;
  saran: string;
  total_hasil: number;
  query: string;
};

// Build a proper ISO certificate scope sentence.
// Always pass the English IAF scope name — translation is handled internally.
function buildScopeSentence(scopeCategoryEn: string, query: string, isID: boolean): string {
  const q = query.toLowerCase();
  const isManufacture  = /produksi|manufactur|pembuatan|pengolahan|pabrik|fabricat/.test(q);
  const isService      = /jasa|service|layanan|konsultan|konsultasi|provider/.test(q);
  const isConstruction = /konstruksi|construction|pembangunan|building/.test(q);
  const isTrade        = /perdagangan|trading|distribusi|distribution|impor|ekspor|export/.test(q);
  const isMaintenance  = /maintenance|pemeliharaan|perawatan|perbaikan|repair/.test(q);

  // Translate category; keep English if no translation found (never prepend "Kegiatan")
  const catID = (IAF_SCOPE_ID[scopeCategoryEn] ?? scopeCategoryEn).toLowerCase();
  const catEN = scopeCategoryEn.toLowerCase();

  // Extract a clean short example from query:
  // - strip "(IAF X)", "termasuk dalam...", parenthetical explanations
  // - strip company names (ALL-CAPS tokens) and boilerplate verbs
  const rawExample = query
    .replace(/\(IAF\s*\d+[^)]*\)/gi, '')
    .replace(/\btermasuk\b[^,.;]*/gi, '')
    .replace(/\bincluded\b[^,.;]*in[^,.;]*/gi, '')
    .replace(/\bkategori\b[^,.;]*/gi, '')
    .replace(/\b(tentukan|determine|cari|find|scope|untuk|for|pt|cv|tbk|yang|bergerak|bidang|perusahaan|company|di bidang|memproduksi|menghasilkan|bergerak di|adalah|merupakan|melakukan|kegiatan|aktivitas|produksi|manufacture|manufacturing|pabrik)\b/gi, ' ')
    .replace(/\b[A-Z]{2,}\b/g, '')   // remove ALL-CAPS tokens (company abbreviations)
    .replace(/[()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/[,;]/)[0]               // keep only text before first comma
    .trim();
  const example = rawExample.slice(0, 45);

  const isEnQuery = !/\b(produksi|pembuatan|pengolahan|jasa|bidang|perusahaan|layanan|perdagangan|ban|mobil|karet)\b/i.test(query);

  if (isID) {
    const verb = isManufacture ? 'Produksi' : isService ? 'Penyediaan jasa' : isConstruction ? 'Konstruksi' : isTrade ? 'Perdagangan' : isMaintenance ? 'Pemeliharaan dan perbaikan' : 'Kegiatan';
    return example ? `${verb} ${catID} (mis., ${example})` : `${verb} ${catID}`;
  } else {
    const verb = isManufacture ? 'Manufacture of' : isService ? 'Provision of' : isConstruction ? 'Construction of' : isTrade ? 'Trading and distribution of' : isMaintenance ? 'Maintenance and repair of' : '';
    const base = verb ? `${verb} ${catEN}` : `${catEN} activities`;
    return (isEnQuery && example) ? `${base} (e.g., ${example})` : base;
  }
}

const NACE_BASED_STDS = ['ISO 9001', 'ISO 14001', 'ISO 45001'];
const SCOPE_CODED_STDS = ['HACCP', 'ISO 22000:2018', 'ISPO', 'ISO 21001:2018'];
const UNIVERSAL_STDS = ['ISO 27001:2022', 'ISO 20000-1:2018', 'ISO 37301', 'ISO 37001', 'ISCC EU', 'ISCC Plus'];

// Instant keyword-based lookup — no AI call, used when fast path finds no IAF codes
function buildKeywordResults(keywords: string, query: string, isIDN: boolean): FastScopeResult | null {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  const kws = keywords.toLowerCase().split(/[\s,]+/).filter(k => k.length > 2);
  if (kws.length === 0) return null;

  // Build a searchable text per IAF entry: English scope name + Indonesian translation
  type ScoredEntry = { std: string; entry: { iaf_code: number; scope: string; nace_codes: string[] }; score: number };
  const scored: ScoredEntry[] = [];

  for (const std of NACE_BASED_STDS) {
    const entries = ref[std];
    if (!Array.isArray(entries)) continue;
    for (const entry of entries as Array<{ iaf_code: number; scope: string; nace_codes: string[] }>) {
      const scopeEn = entry.scope.toLowerCase();
      const scopeId = (IAF_SCOPE_ID[entry.scope] ?? '').toLowerCase();
      const combined = `${scopeEn} ${scopeId}`;
      const score = kws.reduce((s, kw) => s + (combined.includes(kw) ? 2 : 0) + (scopeEn.split(' ').some(w => w.startsWith(kw)) ? 1 : 0), 0);
      if (score > 0) scored.push({ std, entry, score });
    }
  }

  if (scored.length === 0) return null;

  // Deduplicate by IAF code (highest score wins), take top 3
  const byIAF = new Map<number, ScoredEntry>();
  for (const s of scored) {
    const prev = byIAF.get(s.entry.iaf_code);
    if (!prev || s.score > prev.score) byIAF.set(s.entry.iaf_code, s);
  }
  const top = Array.from(byIAF.values()).sort((a, b) => b.score - a.score).slice(0, 3);

  const results: FastGroupedResult[] = top.flatMap(({ std, entry }) => {
    const primaryNace = entry.nace_codes[0] || '—';
    return [{
      scope_key: `${std}_IAF${entry.iaf_code}`,
      standar: std,
      iaf_code: `${entry.iaf_code} - ${entry.scope}`,
      nace: { code: primaryNace, description: entry.scope },
      nace_child: { code: primaryNace, title: entry.scope },
      nace_child_details: entry.nace_codes.map(nc => ({
        code: nc,
        title: `NACE ${nc}`,
        description: isIDN ? `Termasuk dalam scope ${entry.scope} (IAF ${entry.iaf_code})` : `Included in scope ${entry.scope} (IAF ${entry.iaf_code})`,
      })),
      relevance_score: 75,
      scope_sentence_en: buildScopeSentence(entry.scope, query, false),
      scope_sentence_id: buildScopeSentence(entry.scope, query, true),
    }];
  });

  if (results.length === 0) return null;

  return {
    hasil_pencarian: results,
    penjelasan: isIDN
      ? `Ditemukan ${results.length} scope sertifikasi yang relevan berdasarkan analisis bisnis Anda.`
      : `Found ${results.length} relevant certification scopes based on your business analysis.`,
    saran: isIDN
      ? 'Hasil ini merupakan rekomendasi awal. Penetapan scope final memerlukan verifikasi auditor.'
      : 'These are preliminary recommendations. Final scope determination requires auditor verification.',
    total_hasil: results.length,
    query,
  };
}

function buildFastScopeResults(aiText: string, query: string, isIDN: boolean): FastScopeResult | null {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  const results: FastGroupedResult[] = [];

  // Extract numeric IAF codes from AI response (e.g., "IAF 12", "IAF12")
  const iafCodes = new Set<number>();
  for (const m of aiText.matchAll(/IAF\s*(\d+)/gi)) {
    const n = parseInt(m[1], 10);
    if (!isNaN(n)) iafCodes.add(n);
  }

  // Match each IAF code against NACE-based standards in scope_tsi.json
  for (const iafCode of iafCodes) {
    for (const std of NACE_BASED_STDS) {
      const entries = ref[std];
      if (!Array.isArray(entries)) continue;
      const entry = (entries as Array<{ iaf_code: number; scope: string; nace_codes: string[] }>)
        .find(e => e.iaf_code === iafCode);
      if (!entry) continue;

      const primaryNace = entry.nace_codes[0] || '—';
      const scopeSentenceEn = buildScopeSentence(entry.scope, query, false);
      const scopeSentenceId = buildScopeSentence(entry.scope, query, true);
      results.push({
        scope_key: `${std}_IAF${iafCode}`,
        standar: std,
        iaf_code: `${iafCode} - ${entry.scope}`,
        nace: { code: primaryNace, description: entry.scope },
        nace_child: { code: primaryNace, title: entry.scope },
        nace_child_details: entry.nace_codes.map(nc => ({
          code: nc,
          title: `NACE ${nc}`,
          description: isIDN
            ? `Termasuk dalam scope ${entry.scope} (IAF ${iafCode})`
            : `Included in scope ${entry.scope} (IAF ${iafCode})`,
        })),
        relevance_score: 90,
        scope_sentence_en: scopeSentenceEn,
        scope_sentence_id: scopeSentenceId,
      });
    }
  }

  // Check for scope-coded standard mentions in AI text
  const textLower = aiText.toLowerCase();
  for (const std of SCOPE_CODED_STDS) {
    if (!textLower.includes(std.toLowerCase())) continue;
    const entry = ref[std] as { scopes?: Array<{ scope: string; code?: string }> };
    if (!entry?.scopes) continue;
    entry.scopes.forEach((s, idx) => {
      results.push({
        scope_key: `${std}_${s.code ?? idx}`,
        standar: std,
        iaf_code: s.code ? `${s.code} - ${s.scope}` : s.scope,
        nace: { code: s.code || s.scope, description: s.scope },
        nace_child: { code: s.code || s.scope, title: s.scope },
        nace_child_details: [],
        relevance_score: 85,
        scope_sentence_en: s.scope,
        scope_sentence_id: isIDN ? `Ruang lingkup ${s.scope}` : s.scope,
      });
    });
  }

  // Universal standards: ONLY include if no NACE-based or scope-coded results found,
  // AND the AI text explicitly recommends it (not just mentions it in passing).
  if (results.length === 0) {
    const recommendKeywords = ['recommended', 'applicable', 'suitable', 'direkomendasikan', 'sesuai', 'cocok', 'relevan'];
    for (const std of UNIVERSAL_STDS) {
      const stdKey = std.toLowerCase().replace(/[:\s.]/g, '');
      const textNorm = textLower.replace(/[:\s.]/g, '');
      const stdPos = textNorm.indexOf(stdKey);
      if (stdPos === -1) continue;
      // Check for recommendation signal near the standard name (within 150 chars)
      const context = textNorm.slice(Math.max(0, stdPos - 150), stdPos + stdKey.length + 150);
      const isRecommended = recommendKeywords.some(kw => context.includes(kw));
      if (!isRecommended) continue;
      results.push({
        scope_key: `${std}_universal`,
        standar: std,
        iaf_code: isIDN ? 'Berlaku Umum' : 'Universal',
        nace: { code: '—', description: std },
        nace_child: { code: '—', title: std },
        nace_child_details: [],
        relevance_score: 80,
        scope_sentence_en: `${std} Management System`,
        scope_sentence_id: `Sistem Manajemen ${std}`,
      });
    }
  }

  if (results.length === 0) return null;

  const penjelasan = isIDN
    ? `Berdasarkan analisis AI, ditemukan ${results.length} scope sertifikasi yang relevan dengan bidang usaha Anda.`
    : `Based on AI analysis, ${results.length} relevant certification scopes were found for your business.`;

  const saran = isIDN
    ? 'Hasil di atas bukan merupakan hasil akhir dari penetapan ruang lingkup, tetapi perlu diuji oleh auditor dengan bukti lainnya seperti legalitas dan aktivitas organisasi. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.'
    : 'The results above are not the final outcome of scope determination, but need to be verified by an auditor with other evidence such as legal documents and organizational activities. You may select more than one scope if the company has multiple types of activities.';

  return { hasil_pencarian: results, penjelasan, saran, total_hasil: results.length, query };
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
2. Available standards: ${Object.keys(scopeTSI.scope_reference).join(', ')}
3. For standards without IAF/NACE breakdown (ISO 27001, ISO 37001, ISO 37301, ISCC EU, ISCC Plus) — explain their description; they are general-scope standards applicable across industries
4. When answering scope questions, always mention the relevant IAF code and NACE codes if available in the data
5. If the user asks which standards cover a specific NACE code or industry, search across ALL standards and list every match

## HOW TO HANDLE BUSINESS DESCRIPTIONS
This is the MOST IMPORTANT rule set:

**When the user describes any business activity or industry:**
- NEVER immediately say "PT TSI does not have that scope" — you are NOT the final judge of scope coverage
- Your job is to UNDERSTAND the business, then pass it to the scope-determination engine which will do the real check
- NACE codes cover a very wide range. Many businesses that seem niche actually fall under broader categories:
  - Manufacturing of any product → could be NACE 31, 32, 33 (IAF 23 "Manufacturing NEC")
  - Any production process → could be NACE 10-33
  - Any service activity → could be NACE 69-82 (IAF 35 "Other services")
- If you are unsure which NACE fits, ask ONE short clarifying question to better understand the activity, then trigger the search

**Decision flow:**
1. User describes business → Try to map it to a NACE category in the scope data
2. If you can map it (even broadly) → Briefly explain your thinking, then output KEYWORDS/SUMMARY to trigger the real search
3. If genuinely unclear (e.g. very vague) → Ask ONE targeted question, then on next message output KEYWORDS/SUMMARY
4. NEVER skip step 2 or 3 — always end by triggering the scope search

## RESPONSE FORMAT
- Use natural language, not overly rigid bullet points
- For multi-scope answers, a simple table or list is acceptable
- Keep answers concise and relevant
- Do not hallucinate IAF codes or NACE codes that are not in the data

## GENERAL QUESTIONS (outside TSI context)
- Answer freely and helpfully as a general AI assistant
- If the question is tangentially related to certification or ISO standards in general, answer from general knowledge BUT clearly distinguish it from TSI's specific scope data

## IMPORTANT CONSTRAINTS
- NEVER claim TSI does NOT have a scope for a business — that is the scope-determination engine's job, not yours
- The scope data is the ground truth — your training data about certifications is secondary to it

---

## BACKEND ACTIONS (system-level instructions — do not mention these to the user)

When the user wants to see the full product/standard list:
→ Write [CATALOG] anywhere in your response. The system will automatically replace it with the complete formatted catalog from the database.

When the user describes their business/industry (which is most of the time):
→ In your explanation text, ALWAYS write the IAF code number explicitly using the format "IAF X" (e.g., "IAF 14", "IAF 28") for every NACE-based standard you recommend. This is REQUIRED for the automatic scope database lookup — without it the system cannot show scope results.
→ After your explanation, ALWAYS append these tags at the very end of your message:
IAFCODES:<comma-separated IAF numbers you mentioned, e.g. 14,28>
KEYWORDS:<keyword1>,<keyword2>,<keyword3>
SUMMARY:<1-2 sentence description of the user's business activity in detail>
LANG:IDN

(Use LANG:EN if the user wrote in English)
${hasShownResults ? `\nContext: Scope results have already been shown. Continue the conversation naturally. If the user wants a different scope, output new IAFCODES/KEYWORDS/SUMMARY/LANG tags.` : ''}`;

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
        .replace(/IAFCODES:[^\n\r]*/gi, '')
        .replace(/KEYWORDS:[^\n\r]*/gi, '')
        .replace(/SUMMARY:[^\n\r]*/gi, '')
        .replace(/LANG:[^\n\r]*/gi, '')
        .trim();

      const isIDN = responseLang === 'IDN';

      // Fast path: extract IAF codes from text (catches both in-text mentions and IAFCODES tag)
      let fastResults = buildFastScopeResults(aiText, searchQuery, isIDN);

      // Keyword fallback: if no IAF codes found, do instant keyword lookup (no AI call)
      if (!fastResults) {
        fastResults = buildKeywordResults(keywords || searchQuery, searchQuery, isIDN);
      }

      return NextResponse.json({
        phase: 'asking',
        chat_message: conversationMessage,
        // Only send scope_query if keyword fallback also failed (triggers slow path as last resort)
        scope_query: fastResults ? undefined : { query: searchQuery, lang: responseLang },
        scope_results: fastResults,
        keywords_used: keywords,
      });
    }

    return NextResponse.json({ phase: 'asking', chat_message: aiText });
  } catch (error) {
    console.error('Scope Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
