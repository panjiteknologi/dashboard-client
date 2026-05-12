import { NextRequest, NextResponse } from 'next/server';
import scopeTSI from '@/lib/scope_tsi.json';

// --- TYPES ---
type NaceChildDetail = {
  code: string;
  title: string;
  description: string;
};

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
// -------------

async function callGLM(messages: { role: string; content: string }[], options?: { json?: boolean; maxTokens?: number }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY is missing');

  const body: Record<string, unknown> = {
    model,
    messages,
    temperature: 0.1,
    max_tokens: options?.maxTokens ?? 500,
  };

  if (options?.json) {
    body.response_format = { type: 'json_object' };
  }

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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenRouter API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string)?.trim() || '';
}

export async function POST(request: NextRequest) {
  try {
    const { query, selectedLang = 'IDN' } = await request.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a string' },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json(
        { error: 'OPENROUTER_API_KEY is missing' },
        { status: 500 }
      );
    }

    const isIndonesian = selectedLang === 'IDN';
    const language = isIndonesian ? 'Indonesian' : 'English';

    // ====== BUILD TSI SCOPE CONTEXT ======
    const tsiScopeContext = JSON.stringify(scopeTSI.scope_reference, null, 2);

    // ====== AI SCOPE MATCHING ======
    const prompt = `You are an expert ISO certification consultant for PT TSI, a certification body in Indonesia.

## PT TSI OFFICIAL ACCREDITATION SCOPE
The following is PT TSI's complete and official list of accredited certification scopes. This is the ONLY data you may reference. Do NOT suggest or invent scopes not listed here.

${tsiScopeContext}

## USER QUERY
"${query}"

**STEP 1 — TYPO CORRECTION:**
Check if the query has spelling/typo mistakes in ${language}. If yes, set "corrected_query" to the corrected version (same language, no translation). If no correction needed, set "corrected_query" to null.
Use the corrected version (or original) for scope matching below.

## YOUR TASK

**CASE 1 — Query MATCHES one or more scopes in PT TSI's data:**
- Identify all relevant standard(s), IAF code(s), and NACE code(s) from the data above
- For each matched NACE code, generate a clear description in ${language} based on your expert knowledge of international NACE classification
- Generate 2-4 nace_child_details per NACE code representing concrete sub-activities under that code
- Include ALL applicable standards (e.g. if query matches both ISO 9001 and ISO 14001, include both)
- For standards with no nace_codes (e.g. ISO 27001, ISO 37001), use nace_code: "—" and generate a general scope description

**CASE 2 — Query does NOT match any scope in PT TSI's data:**
- Set "found_in_tsi": false
- Explain clearly in ${language} that PT TSI does not hold accreditation for that scope
- Set results to empty array []
- Still set corrected_query if a typo was detected

## SCORING
- 90-100: Exact match — user's activity/product/industry is directly described by the scope
- 70-89: Strong match — closely related activity or product
- 50-69: Moderate match — same broader industry sector
- Below 50: Exclude

## CRITICAL RULES
- ONLY use standard names that exist as keys in the data (e.g. "ISO 9001", "ISO 14001", "ISO 45001", "HACCP", etc.)
- ONLY use iaf_code values that exist under that standard's entry
- ONLY use nace_codes values listed under the matched standard + IAF entry
- Write penjelasan and saran in ${language}
- nace_child_details must be realistic sub-activities based on the NACE code's international classification

## OUTPUT (valid JSON only, no markdown wrapper):
{
  "found_in_tsi": true,
  "corrected_query": null,
  "results": [
    {
      "standard": "ISO 9001",
      "iaf_code": 28,
      "iaf_scope": "Construction",
      "nace_code": "41",
      "nace_description": "Construction of residential and non-residential buildings, including new work, additions, alterations, and repairs.",
      "nace_child_title": "General construction of buildings",
      "nace_child_details": [
        { "code": "41.1", "title": "Development of building projects", "description": "Development and sale of building projects covering residential, commercial, and industrial buildings." },
        { "code": "41.2", "title": "Construction of residential and non-residential buildings", "description": "General contracting for construction of houses, apartments, offices, factories, and public buildings." }
      ],
      "relevance_score": 90
    }
  ],
  "penjelasan": "Detailed explanation in ${language} of why these scopes match the query.",
  "saran": "Recommendation in ${language} about next steps for scope determination."
}`;

    let aiResult: AITSIResponse | undefined;
    let attempt = 0;
    const maxRetries = 3;

    while (attempt < maxRetries) {
      let responseText = '';
      try {
        responseText = await callGLM(
          [{ role: 'user', content: prompt }],
          { json: true, maxTokens: 5000 }
        );

        if (!responseText) {
          console.error(`[scope-determination] Empty response on attempt ${attempt + 1}`);
        } else {
          let cleanedText = responseText.trim();
          if (cleanedText.startsWith('```json')) {
            cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
          } else if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
          }
          aiResult = JSON.parse(cleanedText) as AITSIResponse;
          if (typeof aiResult.found_in_tsi === 'boolean') {
            break;
          }
          console.error(`[scope-determination] Missing found_in_tsi on attempt ${attempt + 1}`);
        }
      } catch (error) {
        if (error instanceof SyntaxError) {
          console.error(`[scope-determination] JSON parse failed on attempt ${attempt + 1}. Raw (first 500 chars):`, responseText.slice(0, 500));
        } else {
          console.error(`[scope-determination] API call failed on attempt ${attempt + 1}:`, error);
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

    // ====== TYPO CORRECTION (from AI response) ======
    const correctedQuery = aiResult.corrected_query && aiResult.corrected_query.toLowerCase() !== query.toLowerCase()
      ? aiResult.corrected_query
      : query;
    const hasCorrected = correctedQuery !== query;

    let correctionPrefix = '';
    if (hasCorrected) {
      correctionPrefix = isIndonesian
        ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
        : `We detected a possible typo in your search. Search "${query}" has been corrected to "${correctedQuery}".\n\n`;
    }

    // ====== HANDLE NOT FOUND IN TSI ======
    if (!aiResult.found_in_tsi || !Array.isArray(aiResult.results) || aiResult.results.length === 0) {
      const penjelasan = correctionPrefix + (aiResult.penjelasan || (isIndonesian
        ? `PT TSI tidak memiliki akreditasi untuk scope "${correctedQuery}". PT TSI hanya dapat melakukan sertifikasi pada ruang lingkup yang telah terakreditasi. Silakan periksa kembali bidang usaha Anda atau hubungi PT TSI untuk informasi lebih lanjut.`
        : `PT TSI does not hold accreditation for the scope "${correctedQuery}". PT TSI can only certify within its accredited scopes. Please review your business field or contact PT TSI for further information.`));

      const saran = aiResult.saran || (isIndonesian
        ? 'Silakan hubungi PT TSI untuk informasi lebih lanjut mengenai ruang lingkup sertifikasi yang tersedia, atau coba dengan kata kunci bidang usaha yang berbeda.'
        : 'Please contact PT TSI for more information about available certification scopes, or try different business activity keywords.');

      return NextResponse.json({
        hasil_pencarian: [],
        penjelasan,
        saran,
        total_hasil: 0,
        query,
        corrected_query: hasCorrected ? correctedQuery : undefined,
      });
    }

    // ====== MAP AI RESULTS TO GroupedResult FORMAT ======
    const groupedResults: GroupedResult[] = aiResult.results
      .filter(r => r.relevance_score >= 50)
      .map(r => ({
        scope_key: r.standard,
        standar: r.standard,
        iaf_code: `${r.iaf_code} - ${r.iaf_scope}`,
        nace: {
          code: r.nace_code,
          description: r.nace_description,
        },
        nace_child: {
          code: r.nace_code,
          title: r.nace_child_title,
        },
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

    // ====== BUILD EXPLANATION ======
    const explanationGroups: Record<string, {
      standar: string;
      iaf_items: Map<string, { iaf_code: string; nace_codes: Set<string> }>;
      max_score: number;
    }> = {};

    for (const result of resultsToShow) {
      const groupKey = result.standar;
      if (!explanationGroups[groupKey]) {
        explanationGroups[groupKey] = { standar: result.standar, iaf_items: new Map(), max_score: result.relevance_score };
      }
      if (!explanationGroups[groupKey].iaf_items.has(result.iaf_code)) {
        explanationGroups[groupKey].iaf_items.set(result.iaf_code, { iaf_code: result.iaf_code, nace_codes: new Set() });
      }
      explanationGroups[groupKey].iaf_items.get(result.iaf_code)!.nace_codes.add(result.nace.code);
      if (result.relevance_score > explanationGroups[groupKey].max_score) {
        explanationGroups[groupKey].max_score = result.relevance_score;
      }
    }

    let penjelasan = correctionPrefix + aiResult.penjelasan + '\n\n';
    penjelasan += isIndonesian ? `**Scope dengan Relevansi Tertinggi:**\n\n` : `**Scopes with Highest Relevance:**\n\n`;

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
      ? `Hasil di atas bukan merupakan hasil akhir dari penetapan ruang lingkup, tetapi perlu diuji oleh auditor dengan bukti lainnya seperti legalitas dan aktivitas organisasi. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.`
      : `The results above are not the final outcome of scope determination, but need to be verified by an auditor with other evidence such as legal documents and organizational activities. You may select more than one scope if the company has multiple types of activities.`);

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
