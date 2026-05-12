import { NextRequest, NextResponse } from 'next/server';
import scopeDataEN from '@/lib/scope_en.json';
import scopeDataID from '@/lib/scope_id.json';

// --- TYPES ---
type NaceChildDetail = {
    code: string;
    title?: string;
    nace_child_detail_description?: string;
    description?: string;
};

type GroupedResult = {
    scope_key: string;
    standar: string;
    iaf_code: string;
    nace: { code: string; description: string };
    nace_child: { code: string; title?: string };
    nace_child_details: NaceChildDetail[];
    relevance_score: number;
};

type AIResultItem = {
    scope_key: string;
    iaf_code: string;
    nace_code: string;
    nace_child_code: string;
    nace_child_detail_code: string;
    relevance_score: number;
};

type AIResponse = {
    hasil_pencarian: AIResultItem[];
    penjelasan: string;
    saran: string;
};
// -------------

async function callGLM(messages: { role: string; content: string }[], options?: { json?: boolean; maxTokens?: number }) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-oss-120b';

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

/**
 * Membersihkan string dari spasi, tanda baca, dan mengubahnya menjadi huruf kecil.
 */
function normalizeString(input: string | undefined): string {
    if (!input) return '';
    const normalizedInput = input.normalize('NFD');
    return normalizedInput.replace(/[̀-ͯ]/g, "")
                           .replace(/[\s,.\-()]/g, '')
                           .toLowerCase();
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

        // ====== TYPO CORRECTION WITH AI ======
        let correctedQuery = query;
        let hasCorrected = false;

        const isIndonesian = selectedLang === 'IDN';
        const correctionLanguage = isIndonesian ? 'Indonesian' : 'English';

        try {
            const typoCheckPrompt = `Analyze the following search query in ${correctionLanguage} language and check for typos or spelling mistakes.
If there are typos, correct them and return ONLY the corrected query in ${correctionLanguage}.
If there are no typos, return the original query exactly as is.

Query: "${query}"

Instructions:
- ONLY return the corrected word/phrase, nothing else
- Focus on ${correctionLanguage} language spelling and grammar
- If no correction needed, return the exact original query
- Do NOT add explanations or extra text
- Do NOT translate the query, only correct typos`;

            const suggestedQuery = await callGLM(
                [{ role: 'user', content: typoCheckPrompt }],
                { maxTokens: 100 }
            );

            const trimmedSuggestion = suggestedQuery?.trim();
            if (trimmedSuggestion && trimmedSuggestion !== query && trimmedSuggestion.toLowerCase() !== query.toLowerCase()) {
                correctedQuery = trimmedSuggestion;
                hasCorrected = true;
            }
        } catch (typoError) {
            console.error('Typo correction failed, using original query:', typoError);
        }

        const scopeData = isIndonesian ? scopeDataID : scopeDataEN;
        const language = isIndonesian ? 'Indonesian' : 'English';

        // --- DIRECT SEARCH LOGIC ---
        function searchInScopeData(keyword: string) {
            const results: AIResultItem[] = [];
            const trimmedKeyword = keyword.trim();
            const wordCount = trimmedKeyword.split(/\s+/).length;
            const isSingleWord = wordCount === 1;
            const isPhrase = wordCount >= 2;

            if (!trimmedKeyword) return results;

            const stopWords = [
                'apa', 'apa?', 'siapa', 'dimana', 'kapan', 'bagaimana', 'kenapa', 'berapa',
                'what', 'what?', 'who', 'where', 'when', 'how', 'why', 'which',
                'perusahaan', 'kami', 'kita', 'saya', 'yang', 'dengan', 'dari', 'untuk',
                'adalah', 'ini', 'itu', 'tersebut', 'cocok', 'sesuai', 'tepat', 'baik',
                'scope', 'bahan', 'jasa', 'layanan', 'industri', 'usaha', 'bidang',
                'company', 'we', 'us', 'our', 'that', 'this', 'with', 'from', 'for',
                'is', 'suitable', 'appropriate', 'good', 'service', 'industry', 'business', 'field',
                'akan', 'sudah', 'telah', 'sedang', 'bisa', 'dapat', 'harus', 'ingin', 'mau', 'perlu',
                'will', 'have', 'has', 'had', 'being', 'can', 'could', 'should', 'want', 'need'
            ];

            const searchWords = isPhrase
                ? trimmedKeyword.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2)
                : [trimmedKeyword.toLowerCase()];

            if (searchWords.length === 0 || (searchWords.length === 1 && searchWords[0].length <= 2)) {
                return results;
            }

            const searchRegex = isSingleWord
                ? new RegExp(`\\b${trimmedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i')
                : null;

            const wordRegexes = searchWords.map(word =>
                new RegExp(`\\b${word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i')
            );

            for (const [scopeKey, scopeValue] of Object.entries(scopeData)) {
                if (!scopeValue.scope || !Array.isArray(scopeValue.scope)) continue;

                for (const iafScope of scopeValue.scope) {
                    if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

                    for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
                        if (!naceDetail?.NACE) continue;
                        if (!Array.isArray(naceDetail.NACE_CHILD)) continue;

                        for (const naceChild of naceDetail.NACE_CHILD) {
                            const childDetails =
                                "nace_child_detail" in naceChild
                                    ? naceChild.nace_child_detail
                                    : "NACE_CHILD_DETAIL" in naceChild
                                    ? naceChild.NACE_CHILD_DETAIL
                                    : undefined;

                            if (!Array.isArray(childDetails)) continue;

                            for (const childDetail of childDetails) {
                                const iafText = iafScope.IAF_CODE?.toLowerCase() || "";
                                const naceText = naceDetail.NACE.nace_description?.toLowerCase() || "";
                                const naceChildText = naceChild.nace_child_title?.toLowerCase() || "";
                                const titleText = childDetail.title?.toLowerCase() || "";
                                const descText = childDetail.nace_child_detail_description?.toLowerCase() || "";

                                const extractedIAF = iafText.match(/\(([^()]+)\)/)?.[1]?.trim() || iafText;

                                let matched = false;
                                let iafMatchCount = 0;
                                let naceMatchCount = 0;
                                let naceChildMatchCount = 0;
                                let titleMatchCount = 0;
                                let descMatchCount = 0;

                                if (isSingleWord && searchRegex) {
                                    const isIafCodeExact = extractedIAF === trimmedKeyword.toUpperCase();

                                    if (isIafCodeExact || iafText.match(searchRegex)) { iafMatchCount = 1; matched = true; }
                                    if (naceText.match(searchRegex)) { naceMatchCount = 1; matched = true; }
                                    if (naceChildText.match(searchRegex)) { naceChildMatchCount = 1; matched = true; }
                                    if (titleText.match(searchRegex)) { titleMatchCount = 1; matched = true; }
                                    if (descText.match(searchRegex)) { descMatchCount = 1; matched = true; }

                                    if (!matched) {
                                        if (extractedIAF === trimmedKeyword) { iafMatchCount = 1; matched = true; }
                                        if (naceDetail.NACE.code === trimmedKeyword) { naceMatchCount = 1; matched = true; }
                                        if (naceChild.code === trimmedKeyword) { naceChildMatchCount = 1; matched = true; }
                                        if (childDetail.code === trimmedKeyword) { titleMatchCount = 1; matched = true; }
                                    }
                                } else if (isPhrase && searchWords.length > 0) {
                                    for (const regex of wordRegexes) {
                                        if (iafText.match(regex)) iafMatchCount++;
                                        if (naceText.match(regex)) naceMatchCount++;
                                        if (naceChildText.match(regex)) naceChildMatchCount++;
                                        if (titleText.match(regex)) titleMatchCount++;
                                        if (descText.match(regex)) descMatchCount++;
                                    }

                                    if (iafMatchCount > 0 || naceMatchCount > 0 || naceChildMatchCount > 0 ||
                                        titleMatchCount > 0 || descMatchCount > 0) {
                                        matched = true;
                                    }
                                }

                                if (matched) {
                                    const score =
                                        (iafMatchCount * 30) +
                                        (naceMatchCount * 20) +
                                        (naceChildMatchCount * 15) +
                                        (titleMatchCount * 10) +
                                        (descMatchCount * 25);

                                    results.push({
                                        scope_key: scopeKey,
                                        iaf_code: iafScope.IAF_CODE,
                                        nace_code: naceDetail.NACE.code,
                                        nace_child_code: naceChild.code,
                                        nace_child_detail_code: childDetail.code,
                                        relevance_score: score,
                                    });
                                }
                            }
                        }
                    }
                }
            }
            return results.filter(r => r.relevance_score > 0);
        }
        // ------------------------------------

        const trimmedQuery = correctedQuery.trim();
        let directSearchResults: AIResultItem[] = [];

        if (trimmedQuery.length > 0) {
            directSearchResults = searchInScopeData(correctedQuery);
        }

        // --- DIRECT SEARCH RESULT PROCESSING ---
        if (directSearchResults.length > 0) {
            directSearchResults.sort((a, b) => b.relevance_score - a.relevance_score);

            const groupedResults: Record<string, GroupedResult> = {};

            for (const result of directSearchResults) {
                const scopeKey = result.scope_key as keyof typeof scopeData;
                const scopeInfo = scopeData[scopeKey];

                if (!scopeInfo) continue;

                const iafScope = scopeInfo.scope.find(s => s.IAF_CODE === result.iaf_code);
                if (!iafScope || !Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

                const naceDetail = iafScope.NACE_DETAIL_INFORMATION.find(n => n.NACE && n.NACE.code === result.nace_code);
                if (!naceDetail || !('NACE' in naceDetail) || !Array.isArray(naceDetail.NACE_CHILD)) continue;

                const naceChild = naceDetail.NACE_CHILD.find(nc => nc.code === result.nace_child_code);
                if (!naceChild) continue;

                const childDetails =
                    "nace_child_detail" in naceChild
                        ? naceChild.nace_child_detail
                        : "NACE_CHILD_DETAIL" in naceChild
                        ? naceChild.NACE_CHILD_DETAIL
                        : undefined;

                if (!Array.isArray(childDetails)) continue;

                const groupKey = `${scopeKey}|${iafScope.IAF_CODE}|${naceDetail.NACE.code}|${naceChild.code}`;

                const currentScore = groupedResults[groupKey]?.relevance_score || 0;
                const newScore = result.relevance_score || 0;
                const finalScore = Math.max(currentScore, newScore);

                if (!groupedResults[groupKey]) {
                    groupedResults[groupKey] = {
                        scope_key: scopeKey,
                        standar: scopeInfo.standar,
                        iaf_code: iafScope.IAF_CODE,
                        nace: {
                            code: naceDetail.NACE.code,
                            description: naceDetail.NACE.nace_description,
                        },
                        nace_child: {
                            code: naceChild.code,
                            title: naceChild.nace_child_title,
                        },
                        nace_child_details: [],
                        relevance_score: finalScore,
                    };
                } else {
                    groupedResults[groupKey].relevance_score = finalScore;
                }

                const sortedDetails = [...childDetails];
                if (result.nace_child_detail_code) {
                    sortedDetails.sort((a, b) => {
                        if (a.code === result.nace_child_detail_code) return -1;
                        if (b.code === result.nace_child_detail_code) return 1;
                        return 0;
                    });
                }

                for (const childDetail of sortedDetails) {
                    const alreadyExists = groupedResults[groupKey].nace_child_details.some(
                        (d: NaceChildDetail) => d.code === childDetail.code
                    );

                    if (!alreadyExists) {
                        groupedResults[groupKey].nace_child_details.push({
                            code: childDetail.code,
                            title: childDetail.title,
                            description: childDetail.nace_child_detail_description,
                        });
                    }
                }
            }

            const detailedResults = Object.values(groupedResults).filter(r => r.relevance_score >= 20 && r.nace_child_details.length > 0);
            detailedResults.sort((a, b) => b.relevance_score - a.relevance_score);

            let penjelasan = '';
            if (hasCorrected) {
                penjelasan = isIndonesian
                    ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
                    : `We detected a possible typo in your search. Search "${query}" has been corrected to "${correctedQuery}".\n\n`;
            }

            const topResults = detailedResults.filter(r => r.relevance_score >= 70).slice(0, 15);
            const resultsToShow = topResults.length > 0 ? topResults : detailedResults.slice(0, 15);

            const explanationGroups: Record<string, {
                standar: string;
                iaf_items: Map<string, {
                    iaf_code: string;
                    nace_items: Map<string, {
                        nace_code: string;
                        nace_description: string;
                        nace_children: Set<string>;
                    }>;
                }>;
                max_score: number;
            }> = {};

            for (const result of resultsToShow) {
                const groupKey = result.standar || result.scope_key;

                if (!explanationGroups[groupKey]) {
                    explanationGroups[groupKey] = {
                        standar: result.standar || result.scope_key,
                        iaf_items: new Map(),
                        max_score: result.relevance_score
                    };
                }

                const iafKey = result.iaf_code;
                if (!explanationGroups[groupKey].iaf_items.has(iafKey)) {
                    explanationGroups[groupKey].iaf_items.set(iafKey, {
                        iaf_code: result.iaf_code,
                        nace_items: new Map()
                    });
                }

                const naceKey = result.nace.code;
                const iafItem = explanationGroups[groupKey].iaf_items.get(iafKey)!;
                if (!iafItem.nace_items.has(naceKey)) {
                    iafItem.nace_items.set(naceKey, {
                        nace_code: result.nace.code,
                        nace_description: result.nace.description,
                        nace_children: new Set()
                    });
                }

                if (result.nace_child?.code) {
                    iafItem.nace_items.get(naceKey)!.nace_children.add(result.nace_child.code);
                }

                if (result.relevance_score > explanationGroups[groupKey].max_score) {
                    explanationGroups[groupKey].max_score = result.relevance_score;
                }
            }

            const groupedForExplanation = Object.values(explanationGroups);

            penjelasan += isIndonesian
                ? `Ditemukan ${detailedResults.length} kategori scope yang sesuai dengan pencarian "${correctedQuery}". Berikut adalah scope dengan relevansi tertinggi:\n\n`
                : `Found ${detailedResults.length} scope categories matching "${correctedQuery}". Here are scopes with highest relevance:\n\n`;

            groupedForExplanation.forEach((group, idx) => {
                penjelasan += `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`;

                Array.from(group.iaf_items.values()).forEach(iafItem => {
                    penjelasan += `IAF: ${iafItem.iaf_code}\n\n`;

                    Array.from(iafItem.nace_items.values()).forEach(naceItem => {
                        const childCodes = Array.from(naceItem.nace_children).sort();
                        penjelasan += `NACE Code (${naceItem.nace_code}): ${naceItem.nace_description}\n`;
                        penjelasan += `NACE Child: ${childCodes.join(', ')}\n\n`;
                    });
                });
            });

            penjelasan += isIndonesian
                ? `Semua hasil ditampilkan berdasarkan tingkat relevansi tertinggi ke terendah. (Menggunakan Pencarian Cepat)`
                : `All results are displayed from highest to lowest relevance. (Using Quick Search)`;

            const saran = isIndonesian
                ? `Hasil yang diperoleh diatas, bukan merupakan hasil akhir dari penetapan ruang lingkup,tetapi perlu diuji oleh auditor dengan bukti lainnya seperti legalitas dan aktivitas organisasi. Anda dapat mengklik kode NACE Child di bagian ringkasan untuk langsung melihat detail scope tersebut. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.`
                : `The results obtained above are not the final outcome of the scope determination, but need to be tested by the auditor with other evidence such as the legality and activities of the organization. You can click on the NACE Child code in the summary section to directly view the scope details. You can select more than one scope if the company has various types of activities.`;

            return NextResponse.json({
                hasil_pencarian: detailedResults,
                penjelasan: penjelasan,
                saran: saran,
                total_hasil: detailedResults.length,
                query: query,
                corrected_query: hasCorrected ? correctedQuery : undefined
            });
        }
        // ------------------------------------

        // =====================================================================================
        // Main Path: Semantic Search dengan GLM AI
        // =====================================================================================
        const scopeContext = JSON.stringify(scopeData, (key, value) => {
            if (key === 'description' && typeof value === 'string') return undefined;
            if (key === 'nace_child_detail') return value;
            if (key === 'NACE_CHILD_DETAIL') return value;
            return value;
        }, 2);

        const prompt = `You are an expert certification scope analyst. Your task is to analyze user queries and find the most relevant certification scopes.

## CONTEXTUAL ANALYSIS FRAMEWORK:

### Step 1: Extract Key Information from Query
Analyze the query: "${correctedQuery}"

**CRITICAL: IGNORE THESE WORDS** (DO NOT use these for search matching):
- Question words: apa, apa?, siapa, dimana, kapan, bagaimana, kenapa, berapa, what, what?, who, where, when, how, why, which
- Generic words: perusahaan, kami, kita, saya, yang, dengan, dari, untuk, adalah, ini, itu, tersebut, cocok, sesuai, tepat, baik, company, we, us, our, that, this, with, from, for, is, suitable, appropriate, good
- Auxiliary verbs: akan, sudah, telah, sedang, bisa, dapat, harus, ingin, mau, perlu, will, have, has, had, being, can, could, should, want, need

**ONLY EXTRACT THESE CRITICAL KEYWORDS**:
1. **Core Activity Verbs**: memproduksi, membuat, mengolah, menjual, menyediakan, membangun, merancang, manufacture, produce, make, process, sell, provide, build, design, etc.
2. **Products/Services** (Nouns): rambut, tekstil, makanan, software, bangunan, kendaraan, hair, textile, food, software, building, vehicle, etc.
3. **Raw Materials** (Nouns): plastik, kayu, logam, karet, beton, plastic, wood, metal, rubber, concrete, etc.
4. **Industry Sector Keywords**: konstruksi, pertanian, teknologi, kesehatan, construction, agriculture, technology, health, etc.
5. **Technical Terms**: sintetis, organik, digital, otomatis, synthetic, organic, digital, automatic, etc.

### Step 2: Semantic Mapping Rules
Use ONLY the filtered keywords for matching. DO NOT search for ignored words.

### Step 3: Search Strategy
1. Search across ALL fields: IAF_CODE, NACE descriptions, NACE_CHILD descriptions, nace_child_detail_description
2. Use ONLY meaningful keywords (activity verbs, product nouns, material nouns)
3. Consider synonyms and related terms
4. Look for both specific matches and broader category matches
5. **REJECT any match that only contains ignored words**

### Step 4: Scoring Guidelines
- **90-100**: Perfect match (exact activity/product mentioned in scope)
- **70-89**: Strong match (closely related activity/product)
- **50-69**: Moderate match (same industry sector or related materials)
- **Below 50**: Weak match (exclude from results)

### Step 5: Special Industry Rules
- **Cement/Concrete industry**: Include both IAF (16) NACE 23.5 AND NACE 23.6
- **Plastic products**: Look for "Manufacture of plastic products" or similar
- **Textile products**: Look for "Tekstil" or "Textile" related scopes
- **Food industry**: Consider both production and processing scopes
- **IT/Software**: Look for "Teknologi informasi" or "Information technology"

## YOUR TASK:
1. Apply the Contextual Analysis Framework above to the user's query
2. Extract the core business activity and materials
3. Find ALL relevant scopes from the provided Data Scope that match the extracted information
4. Return minimum 3-5 results if available, maximum unlimited
5. Assign accurate relevance scores based on the scoring guidelines
6. Provide explanation in **${language}** about why these scopes were selected

Data Scope:
${scopeContext}

User Query: "${correctedQuery}"

CRITICAL OUTPUT RULES:
- Every entry MUST reference valid scope_key, iaf_code, nace_code, nace_child_code, and nace_child_detail_code from Data Scope
- Do NOT invent or guess codes - only use codes that exist in the data
- **ONLY return results that match meaningful keywords**
- Return ALL results with score >= 50
- Sort by relevance_score (highest first)
- Response MUST be valid JSON with this exact structure:
{
  "hasil_pencarian": [{"scope_key":"...","iaf_code":"...","nace_code":"...","nace_child_code":"...","nace_child_detail_code":"...","relevance_score":0}],
  "penjelasan": "...",
  "saran": "..."
}`;

        let aiResult: AIResponse | undefined;
        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
            try {
                const responseText = await callGLM(
                    [{ role: 'user', content: prompt }],
                    { json: true, maxTokens: 8192 }
                );

                if (!responseText) {
                    console.error(`GLM returned empty response on attempt ${attempt + 1}`);
                } else {
                    let cleanedText = responseText.trim();
                    if (cleanedText.startsWith('```json')) {
                        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                    } else if (cleanedText.startsWith('```')) {
                        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
                    }

                    aiResult = JSON.parse(cleanedText) as AIResponse;

                    if (aiResult.hasil_pencarian && Array.isArray(aiResult.hasil_pencarian)) {
                        break;
                    }
                }
            } catch (error) {
                console.error(`Error processing GLM response on attempt ${attempt + 1}:`, error);
            }
            attempt++;
        }

        if (!aiResult || !Array.isArray(aiResult.hasil_pencarian)) {
            const errorPenjelasan = isIndonesian
                ? `Terjadi kesalahan internal dalam memproses respons AI. Mohon coba kata kunci yang berbeda. Query: "${correctedQuery}"`
                : `An internal error occurred while processing the AI response. Please try different keywords. Query: "${correctedQuery}"`;
            const errorSaran = isIndonesian
                ? "Silakan coba dengan kata kunci yang lebih spesifik"
                : "Please try with more specific keywords";

            return NextResponse.json({
                hasil_pencarian: [],
                penjelasan: errorPenjelasan,
                saran: errorSaran,
                query: query
            }, { status: 500 });
        }

        const groupedResults: Record<string, GroupedResult> = {};

        for (const result of aiResult.hasil_pencarian) {
            const aiScopeKey = result.scope_key;

            const actualScopeKey = Object.keys(scopeData).find(
                key => key.toLowerCase() === aiScopeKey.toLowerCase()
            ) as keyof typeof scopeData;

            if (!actualScopeKey) {
                console.warn(`[Grouping Skip] Scope key '${aiScopeKey}' not found in source data.`);
                continue;
            }

            const scopeInfo = scopeData[actualScopeKey];
            const aiIAFCodeNormalized = normalizeString(result.iaf_code);

            const iafScope = scopeInfo.scope.find(s => {
                const dataIAFCodeNormalized = normalizeString(s.IAF_CODE);
                return dataIAFCodeNormalized === aiIAFCodeNormalized;
            });

            if (!iafScope || !Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) {
                console.warn(`[Grouping Skip] IAF code '${result.iaf_code}' not found in scope ${actualScopeKey}.`);
                continue;
            }

            const naceDetail = iafScope.NACE_DETAIL_INFORMATION.find(n => n.NACE && n.NACE.code === result.nace_code);
            if (!naceDetail || typeof naceDetail !== 'object' || !('NACE' in naceDetail) || !Array.isArray(naceDetail.NACE_CHILD)) {
                console.warn(`[Grouping Skip] NACE detail structure error: ${result.nace_code}`);
                continue;
            }

            const naceChild = naceDetail.NACE_CHILD.find(nc => nc.code === result.nace_child_code);
            if (!naceChild) {
                console.warn(`[Grouping Skip] NACE Child code not found: ${result.nace_child_code}`);
                continue;
            }

            const childDetails =
                "nace_child_detail" in naceChild
                ? naceChild.nace_child_detail
                : "NACE_CHILD_DETAIL" in naceChild
                ? naceChild.NACE_CHILD_DETAIL
                : undefined;

            if (!Array.isArray(childDetails)) continue;

            const detailResult = childDetails.find(cd => cd.code === result.nace_child_detail_code);
            if (!detailResult) {
                console.warn(`[Grouping Skip] NACE Detail Code NOT FOUND: ${result.nace_child_detail_code}`);
                continue;
            }

            const groupKey = `${actualScopeKey}|${iafScope.IAF_CODE}|${naceDetail.NACE.code}|${naceChild.code}`;
            const currentScore = groupedResults[groupKey]?.relevance_score || 0;
            const newScore = result.relevance_score || 0;
            const finalScore = Math.max(currentScore, newScore);

            if (!groupedResults[groupKey]) {
                groupedResults[groupKey] = {
                    scope_key: actualScopeKey,
                    standar: scopeInfo.standar,
                    iaf_code: iafScope.IAF_CODE,
                    nace: {
                        code: naceDetail.NACE.code,
                        description: naceDetail.NACE.nace_description,
                    },
                    nace_child: {
                        code: naceChild.code,
                        title: naceChild.nace_child_title,
                    },
                    nace_child_details: [],
                    relevance_score: finalScore,
                };
            } else {
                groupedResults[groupKey].relevance_score = finalScore;
            }

            const sortedDetails = [...childDetails];
            sortedDetails.sort((a, b) => {
                if (a.code === result.nace_child_detail_code) return -1;
                if (b.code === result.nace_child_detail_code) return 1;
                return 0;
            });

            for (const childDetail of sortedDetails) {
                const alreadyExists = groupedResults[groupKey].nace_child_details.some(
                    (d: NaceChildDetail) => d.code === childDetail.code
                );

                if (!alreadyExists) {
                    groupedResults[groupKey].nace_child_details.push({
                        code: childDetail.code,
                        title: childDetail.title,
                        description: childDetail.nace_child_detail_description,
                    });
                }
            }
        }

        const detailedResults = Object.values(groupedResults).filter(r => r.relevance_score >= 50 && r.nace_child_details.length > 0);
        detailedResults.sort((a, b) => b.relevance_score - a.relevance_score);

        let penjelasan = '';
        if (hasCorrected) {
            penjelasan = isIndonesian
                ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
                : `We detected a possible typo in your search. Search "${query}" has been corrected to "${correctedQuery}".\n\n`;
        }

        penjelasan += aiResult.penjelasan + '\n\n';

        const topResults = detailedResults.filter(r => r.relevance_score >= 70).slice(0, 15);
        const resultsToShow = topResults.length > 0 ? topResults : detailedResults.slice(0, 15);

        const explanationGroups: Record<string, {
            standar: string;
            iaf_items: Map<string, {
                iaf_code: string;
                nace_items: Map<string, {
                    nace_code: string;
                    nace_description: string;
                    nace_children: Set<string>;
                }>;
            }>;
            max_score: number;
        }> = {};

        for (const result of resultsToShow) {
            const groupKey = result.standar || result.scope_key;

            if (!explanationGroups[groupKey]) {
                explanationGroups[groupKey] = {
                    standar: result.standar || result.scope_key,
                    iaf_items: new Map(),
                    max_score: result.relevance_score
                };
            }

            const iafKey = result.iaf_code;
            if (!explanationGroups[groupKey].iaf_items.has(iafKey)) {
                explanationGroups[groupKey].iaf_items.set(iafKey, {
                    iaf_code: result.iaf_code,
                    nace_items: new Map()
                });
            }

            const naceKey = result.nace.code;
            const iafItem = explanationGroups[groupKey].iaf_items.get(iafKey)!;
            if (!iafItem.nace_items.has(naceKey)) {
                iafItem.nace_items.set(naceKey, {
                    nace_code: result.nace.code,
                    nace_description: result.nace.description,
                    nace_children: new Set()
                });
            }

            if (result.nace_child?.code) {
                iafItem.nace_items.get(naceKey)!.nace_children.add(result.nace_child.code);
            }

            if (result.relevance_score > explanationGroups[groupKey].max_score) {
                explanationGroups[groupKey].max_score = result.relevance_score;
            }
        }

        const groupedForExplanation = Object.values(explanationGroups);

        penjelasan += isIndonesian
            ? `**Scope dengan Relevansi Tertinggi:**\n\n`
            : `**Scopes with Highest Relevance:**\n\n`;

        groupedForExplanation.forEach((group, idx) => {
            penjelasan += `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`;

            Array.from(group.iaf_items.values()).forEach(iafItem => {
                penjelasan += `IAF: ${iafItem.iaf_code}\n\n`;

                Array.from(iafItem.nace_items.values()).forEach(naceItem => {
                    const childCodes = Array.from(naceItem.nace_children).sort();
                    penjelasan += `NACE Code (${naceItem.nace_code}): ${naceItem.nace_description}\n`;
                    penjelasan += `NACE Child: ${childCodes.join(', ')}\n\n`;
                });
            });
        });

        penjelasan += isIndonesian
            ? `Total ${detailedResults.length} hasil ditemukan. Semua hasil ditampilkan berdasarkan tingkat relevansi tertinggi ke terendah. (Menggunakan GLM AI Semantic Search)`
            : `Total ${detailedResults.length} results found. All results are displayed from highest to lowest relevance. (Using GLM AI Semantic Search)`;

        let saran = aiResult.saran;
        saran += isIndonesian
            ? `\n\nAnda dapat mengklik kode NACE Child di bagian ringkasan untuk langsung melihat detail scope tersebut.`
            : `\n\nYou can click on NACE Child codes in the summary section to directly view the details of that scope.`;

        return NextResponse.json({
            hasil_pencarian: detailedResults,
            penjelasan: penjelasan,
            saran: saran,
            total_hasil: detailedResults.length,
            query: query,
            corrected_query: hasCorrected ? correctedQuery : undefined
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
