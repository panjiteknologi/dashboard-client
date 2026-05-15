import { NextRequest, NextResponse } from 'next/server';
import scopeTSI from '@/lib/scope_tsi.json';

// --- TYPES ---
type NaceChildDetail = { code: string; title: string; description: string };
type GroupedResult = {
  scope_key: string;
  standar: string;
  iaf_code: string;
  nace: { code: string; description: string };
  nace_child: { code: string; title: string };
  nace_child_details: NaceChildDetail[];
  relevance_score: number;
};
type AIMatchedScope = {
  standard: string;
  iaf_code: number | string;
  iaf_scope: string;
  nace_code: string;
  nace_description: string;
  nace_child_title: string;
  nace_child_details: NaceChildDetail[];
  relevance_score: number;
};
type AITSIResponse = {
  found_in_tsi: boolean;
  corrected_query?: string | null;
  results: AIMatchedScope[];
  penjelasan: string;
  saran: string;
};

// --- NACE code prefix matching with "except" support ---
function naceCodeMatches(aiCode: string, pattern: string): boolean {
  const exceptMatch = pattern.match(/^(.+?)\s+except\s+(.+)$/i);
  if (exceptMatch) {
    const base = exceptMatch[1].trim();
    const exceptions = exceptMatch[2].split(/\s+and\s+/i).map(e => e.trim());
    if (aiCode !== base && !aiCode.startsWith(base + '.')) return false;
    return !exceptions.some(ex => aiCode === ex || aiCode.startsWith(ex + '.'));
  }
  return aiCode === pattern || aiCode.startsWith(pattern + '.');
}

// --- Code-level validation: check AI suggestion against scope_tsi.json ---
function validateInTSI(standard: string, iafCode: number | string, naceCode: string): boolean {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  if (!(standard in ref)) return false;
  const entry = ref[standard];

  // NACE-based standards: ISO 9001, ISO 14001, ISO 45001
  if (Array.isArray(entry)) {
    const iafNum = typeof iafCode === 'number' ? iafCode : parseInt(String(iafCode), 10);
    for (const scope of entry as Array<{ iaf_code: number; nace_codes: string[] }>) {
      if (scope.iaf_code === iafNum) {
        for (const pattern of scope.nace_codes) {
          if (naceCodeMatches(naceCode, pattern)) return true;
        }
      }
    }
    return false;
  }

  // Scope-coded standards: HACCP, ISO 22000:2018, ISPO, ISO 21001:2018
  const scopeEntry = entry as { scopes?: Array<{ scope?: string; code?: string }> };
  if (scopeEntry.scopes && scopeEntry.scopes.length > 0) {
    const codeStr = String(iafCode);
    return scopeEntry.scopes.some(s =>
      s.code === codeStr || s.code === naceCode ||
      s.scope === codeStr || s.scope === naceCode
    );
  }

  // Description-only standards (ISO 27001, ISO 37001, etc.): standard exists = valid
  return true;
}

const NACE_BASED_STANDARDS = ['ISO 9001', 'ISO 14001', 'ISO 45001'];

// Find all NACE-based standards that have the given IAF code + NACE code combination
function findNACEBasedMatches(iafCode: number | string, naceCode: string): string[] {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  const iafNum = typeof iafCode === 'number' ? iafCode : parseInt(String(iafCode), 10);
  const matching: string[] = [];
  for (const std of NACE_BASED_STANDARDS) {
    const entries = ref[std];
    if (!Array.isArray(entries)) continue;
    for (const scope of entries as Array<{ iaf_code: number; nace_codes: string[] }>) {
      if (scope.iaf_code === iafNum) {
        if (scope.nace_codes.some(p => naceCodeMatches(naceCode, p))) {
          matching.push(std);
          break;
        }
      }
    }
  }
  return matching;
}

// Tier-3 fallback: find correct standard+IAF by NACE code alone (ignores AI-provided IAF)
function findNACEOnlyMatches(naceCode: string): Array<{ standard: string; iaf_code: number; iaf_scope: string }> {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  const matching: Array<{ standard: string; iaf_code: number; iaf_scope: string }> = [];
  for (const std of NACE_BASED_STANDARDS) {
    const entries = ref[std];
    if (!Array.isArray(entries)) continue;
    for (const scope of entries as Array<{ iaf_code: number; scope: string; nace_codes: string[] }>) {
      if (scope.nace_codes.some(p => naceCodeMatches(naceCode, p))) {
        if (!matching.some(m => m.standard === std && m.iaf_code === scope.iaf_code)) {
          matching.push({ standard: std, iaf_code: scope.iaf_code, iaf_scope: scope.scope });
        }
      }
    }
  }
  return matching;
}

// --- Build compact TSI context with NACE codes inline ---
function buildCompactTSIContext(): string {
  type ScopeRef = Record<string, unknown>;
  const ref = scopeTSI.scope_reference as ScopeRef;
  const lines: string[] = [];

  lines.push('## NACE-based Standards');
  lines.push('(Pick the IAF entry whose NACE codes BEST FIT the user activity — not necessarily the primary textbook code, but the closest available match in this list)');
  for (const std of ['ISO 9001', 'ISO 14001', 'ISO 45001']) {
    const entries = ref[std] as Array<{ iaf_code: number; scope: string; nace_codes: string[] }>;
    if (!Array.isArray(entries)) continue;
    lines.push(`\n### ${std}`);
    entries.forEach(e => lines.push(`- IAF ${e.iaf_code} "${e.scope}": ${e.nace_codes.join(', ')}`));
  }

  lines.push('\n## Scope-coded Standards (use exact codes/names below):');

  const haccp = ref['HACCP'] as { scopes: Array<{ scope: string; code: string }> };
  lines.push('\n### HACCP  →  set iaf_code and nace_code to the code value');
  haccp.scopes.forEach(s => lines.push(`- "${s.code}": ${s.scope}`));

  const iso22000 = ref['ISO 22000:2018'] as { scopes: Array<{ scope: string; code: string }> };
  lines.push('\n### ISO 22000:2018  →  set iaf_code and nace_code to the code value');
  iso22000.scopes.forEach(s => lines.push(`- "${s.code}": ${s.scope}`));

  const ispo = ref['ISPO'] as { scopes: Array<{ scope: string }> };
  lines.push('\n### ISPO  →  set iaf_scope and nace_code to the exact scope name below');
  ispo.scopes.forEach(s => lines.push(`- "${s.scope}"`));

  const iso21001 = ref['ISO 21001:2018'] as { scopes: Array<{ scope: string }> };
  lines.push('\n### ISO 21001:2018  →  set iaf_scope and nace_code to the exact scope name below');
  iso21001.scopes.forEach(s => lines.push(`- "${s.scope}"`));

  lines.push('\n## General Management Standards (use nace_code: "—"):');
  lines.push('- ISO 27001:2022: Information Security Management System');
  lines.push('- ISO 20000-1:2018: IT Service Management');
  lines.push('- ISO 37301: Compliance Management System');
  lines.push('- ISO 37001: Anti-Bribery Management System');
  lines.push('- ISCC EU: Biofuel & Renewable Energy (RED II) certification');
  lines.push('- ISCC Plus: Sustainable supply chain certification');

  return lines.join('\n');
}

async function callAI(
  messages: { role: string; content: string }[],
  options?: { json?: boolean; maxTokens?: number }
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.OPENROUTER_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1:free';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing');

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0,
    max_tokens: options?.maxTokens ?? 5000,
  };
  if (options?.json) body.response_format = { type: 'json_object' };

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://tsicertification.co.id',
      'X-Title': 'TSI Scope Determination',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string)?.trim() || '';
}

export async function POST(request: NextRequest) {
  try {
    const { query, selectedLang = 'IDN' } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Query parameter is required and must be a string' }, { status: 400 });
    }
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is missing' }, { status: 500 });
    }

    const isIndonesian = selectedLang === 'IDN';
    const language = isIndonesian ? 'Indonesian' : 'English';
    const tsiContext = buildCompactTSIContext();

    const prompt = `You are an expert ISO certification consultant with deep knowledge of NACE Rev.2 industry classification and IAF (International Accreditation Forum) scope codes.

## PT TSI ACCREDITATION CATALOG
${tsiContext}

## USER QUERY
"${query}"

## YOUR TASK

**STEP 1 — TYPO CORRECTION:**
Check if the query has spelling/typo mistakes in ${language}. If yes, set "corrected_query" to the corrected version. If no correction needed, set null.

**STEP 2 — SCOPE IDENTIFICATION using your expert knowledge:**

**CASE 1 — Query MATCHES one or more PT TSI scopes:**
For NACE-based standards (ISO 9001, ISO 14001, ISO 45001):
- Scan the available NACE codes in the catalog to find which entry BEST FITS the user's activity
- IMPORTANT: the user's activity may not have a direct NACE match (e.g. "wastewater treatment maintenance" is not NACE 37 here — instead look at NACE 71/72 for engineering services, NACE 43 for specialised construction, or NACE 81/82 for maintenance/cleaning services)
- Always prefer an available NACE code over returning not-found
- Generate accurate NACE description and 2-3 realistic sub-activities (nace_child_details) from your NACE expertise
- Include ALL applicable standards (e.g. construction may fit ISO 9001, ISO 14001, and ISO 45001)

For HACCP / ISO 22000:2018:
- Set iaf_code and nace_code to the exact scope code from the catalog (e.g. "01", "CI")

For ISPO / ISO 21001:2018:
- Set iaf_scope and nace_code to the exact scope name from the catalog (e.g. "Perkebunan")

For General Standards (ISO 27001, ISO 37001, etc.):
- Use nace_code: "—" and describe the general applicability

SCORING: 90-100 = exact match | 70-89 = strong | 50-69 = moderate | below 50 = exclude

**CASE 2 — Query does NOT match any PT TSI scope:**
- Set "found_in_tsi": false, results: []
- Explain in ${language} why it does not match

## CRITICAL RULES:
- ONLY use standard names exactly as listed in the catalog (e.g. "ISO 9001", "ISO 22000:2018")
- ONLY use IAF codes listed under that standard in the catalog
- For scope-coded standards, ONLY use codes/names exactly as listed
- Write penjelasan and saran in ${language}

## OUTPUT (valid JSON only, no markdown):
{
  "found_in_tsi": true,
  "corrected_query": null,
  "results": [
    {
      "standard": "ISO 9001",
      "iaf_code": 28,
      "iaf_scope": "Construction",
      "nace_code": "41",
      "nace_description": "Construction of residential and non-residential buildings.",
      "nace_child_title": "Construction of buildings",
      "nace_child_details": [
        { "code": "41.10", "title": "Development of building projects", "description": "Development and sale of residential and commercial building projects." },
        { "code": "41.20", "title": "Construction of residential and non-residential buildings", "description": "General contracting for construction of houses, offices, factories, and public buildings." }
      ],
      "relevance_score": 92
    }
  ],
  "penjelasan": "Explanation in ${language}",
  "saran": "Recommendation in ${language}"
}`;

    let aiResult: AITSIResponse | undefined;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      let responseText = '';
      try {
        responseText = await callAI([{ role: 'user', content: prompt }], { json: true, maxTokens: 5000 });

        if (!responseText) {
          console.error(`[scope-determination] Empty response on attempt ${attempt + 1}`);
          attempt++;
          continue;
        }

        let cleanedText = responseText.trim();
        if (cleanedText.startsWith('```json')) {
          cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
        } else if (cleanedText.startsWith('```')) {
          cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
        }

        aiResult = JSON.parse(cleanedText) as AITSIResponse;
        if (typeof aiResult.found_in_tsi === 'boolean') break;
        console.error(`[scope-determination] Missing found_in_tsi on attempt ${attempt + 1}`);
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(`[scope-determination] JSON parse failed attempt ${attempt + 1}:`, responseText.slice(0, 500));
        } else {
          console.error(`[scope-determination] API error attempt ${attempt + 1}:`, error);
        }
      }
      attempt++;
    }

    if (!aiResult) {
      return NextResponse.json({
        hasil_pencarian: [],
        penjelasan: isIndonesian
          ? `Terjadi kesalahan internal dalam memproses respons AI. Mohon coba kata kunci yang berbeda. Query: "${query}"`
          : `An internal error occurred while processing the AI response. Please try different keywords. Query: "${query}"`,
        saran: isIndonesian
          ? 'Silakan coba dengan kata kunci yang lebih spesifik'
          : 'Please try with more specific keywords',
        total_hasil: 0,
        query,
      }, { status: 500 });
    }

    // --- Typo correction ---
    const correctedQuery =
      aiResult.corrected_query && aiResult.corrected_query.toLowerCase() !== query.toLowerCase()
        ? aiResult.corrected_query
        : query;
    const hasCorrected = correctedQuery !== query;
    const correctionPrefix = hasCorrected
      ? (isIndonesian
        ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
        : `We detected a possible typo in your search. "${query}" has been corrected to "${correctedQuery}".\n\n`)
      : '';

    // --- AI says not found ---
    if (!aiResult.found_in_tsi || !Array.isArray(aiResult.results) || aiResult.results.length === 0) {
      return NextResponse.json({
        hasil_pencarian: [],
        penjelasan: correctionPrefix + (aiResult.penjelasan || (isIndonesian
          ? `PT TSI tidak memiliki akreditasi untuk scope "${correctedQuery}".`
          : `PT TSI does not hold accreditation for the scope "${correctedQuery}".`)),
        saran: aiResult.saran || (isIndonesian
          ? 'Silakan hubungi PT TSI untuk informasi lebih lanjut mengenai ruang lingkup sertifikasi yang tersedia.'
          : 'Please contact PT TSI for more information about available certification scopes.'),
        total_hasil: 0,
        query,
        corrected_query: hasCorrected ? correctedQuery : undefined,
      });
    }

    // --- Code-level validation against scope_tsi.json ---
    // Tier 1: direct match (standard + IAF + NACE all correct)
    // Tier 2: cross-standard fallback (same IAF+NACE, AI picked wrong standard)
    // Tier 3: NACE-only fallback (AI's IAF wrong too — find correct standard+IAF from NACE alone)
    const validatedResults: AIMatchedScope[] = [];
    for (const r of aiResult.results.filter(r => r.relevance_score >= 50)) {
      if (NACE_BASED_STANDARDS.includes(r.standard)) {
        if (validateInTSI(r.standard, r.iaf_code, r.nace_code)) {
          // Tier 1
          validatedResults.push(r);
        } else {
          // Tier 2: cross-standard by IAF+NACE
          const fallbackStds = findNACEBasedMatches(r.iaf_code, r.nace_code);
          let tier2Added = false;
          for (const std of fallbackStds) {
            if (!validatedResults.some(v => v.standard === std && v.iaf_code === r.iaf_code && v.nace_code === r.nace_code)) {
              validatedResults.push({ ...r, standard: std });
              tier2Added = true;
            }
          }
          if (!tier2Added) {
            // Tier 3: NACE-only — ignore AI's IAF, find correct standard+IAF from NACE alone
            const naceMatches = findNACEOnlyMatches(r.nace_code);
            for (const match of naceMatches) {
              if (!validatedResults.some(v => v.standard === match.standard && v.nace_code === r.nace_code)) {
                validatedResults.push({ ...r, standard: match.standard, iaf_code: match.iaf_code, iaf_scope: match.iaf_scope });
              }
            }
          }
        }
      } else {
        if (validateInTSI(r.standard, r.iaf_code, r.nace_code)) {
          validatedResults.push(r);
        }
      }
    }

    // AI suggested scopes but none passed TSI validation
    if (validatedResults.length === 0) {
      return NextResponse.json({
        hasil_pencarian: [],
        penjelasan: correctionPrefix + (isIndonesian
          ? `PT TSI belum memiliki akreditasi untuk ruang lingkup sertifikasi yang sesuai dengan "${correctedQuery}". PT TSI hanya dapat melakukan sertifikasi pada ruang lingkup yang telah terakreditasi.`
          : `PT TSI does not currently hold accreditation for the certification scope matching "${correctedQuery}". PT TSI can only certify within its accredited scopes.`),
        saran: isIndonesian
          ? 'Silakan hubungi PT TSI untuk informasi lebih lanjut atau coba kata kunci bidang usaha yang berbeda.'
          : 'Please contact PT TSI for more information or try different business activity keywords.',
        total_hasil: 0,
        query,
        corrected_query: hasCorrected ? correctedQuery : undefined,
      });
    }

    // --- Map validated results to GroupedResult format ---
    const groupedResults: GroupedResult[] = validatedResults.map(r => ({
      scope_key: r.standard,
      standar: r.standard,
      iaf_code: `${r.iaf_code} - ${r.iaf_scope}`,
      nace: { code: r.nace_code, description: r.nace_description },
      nace_child: { code: r.nace_code, title: r.nace_child_title },
      nace_child_details: (r.nace_child_details || []).map(d => ({
        code: d.code,
        title: d.title,
        description: d.description,
      })),
      relevance_score: r.relevance_score,
    }));

    groupedResults.sort((a, b) => b.relevance_score - a.relevance_score);

    const topResults = groupedResults.filter(r => r.relevance_score >= 70).slice(0, 15);
    const resultsToShow = topResults.length > 0 ? topResults : groupedResults.slice(0, 15);

    // --- Build explanation ---
    const explanationGroups: Record<string, {
      standar: string;
      iaf_items: Map<string, { iaf_code: string; nace_codes: Set<string> }>;
      max_score: number;
    }> = {};

    for (const result of resultsToShow) {
      if (!explanationGroups[result.standar]) {
        explanationGroups[result.standar] = { standar: result.standar, iaf_items: new Map(), max_score: result.relevance_score };
      }
      if (!explanationGroups[result.standar].iaf_items.has(result.iaf_code)) {
        explanationGroups[result.standar].iaf_items.set(result.iaf_code, { iaf_code: result.iaf_code, nace_codes: new Set() });
      }
      explanationGroups[result.standar].iaf_items.get(result.iaf_code)!.nace_codes.add(result.nace.code);
      if (result.relevance_score > explanationGroups[result.standar].max_score) {
        explanationGroups[result.standar].max_score = result.relevance_score;
      }
    }

    let penjelasan = correctionPrefix + aiResult.penjelasan + '\n\n';
    penjelasan += isIndonesian ? '**Scope dengan Relevansi Tertinggi:**\n\n' : '**Scopes with Highest Relevance:**\n\n';
    Object.values(explanationGroups).forEach((group, idx) => {
      penjelasan += `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`;
      Array.from(group.iaf_items.values()).forEach(iafItem => {
        penjelasan += `IAF: ${iafItem.iaf_code}\n`;
        penjelasan += `NACE Codes: ${Array.from(iafItem.nace_codes).sort().join(', ')}\n\n`;
      });
    });
    penjelasan += isIndonesian
      ? `Total ${groupedResults.length} hasil ditemukan. Semua hasil ditampilkan berdasarkan tingkat relevansi tertinggi ke terendah. (Menggunakan TSI Scope AI)`
      : `Total ${groupedResults.length} results found. All results are displayed from highest to lowest relevance. (Using TSI Scope AI)`;

    const saran = (aiResult.saran ? aiResult.saran + '\n\n' : '') + (isIndonesian
      ? 'Hasil di atas bukan merupakan hasil akhir dari penetapan ruang lingkup, tetapi perlu diuji oleh auditor dengan bukti lainnya seperti legalitas dan aktivitas organisasi. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.'
      : 'The results above are not the final outcome of scope determination, but need to be verified by an auditor with other evidence such as legal documents and organizational activities. You may select more than one scope if the company has multiple types of activities.');

    return NextResponse.json({
      hasil_pencarian: resultsToShow,
      penjelasan,
      saran,
      total_hasil: groupedResults.length,
      query,
      corrected_query: hasCorrected ? correctedQuery : undefined,
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
