import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
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
    iaf_code: string; // Akan berisi string deskriptif penuh (e.g., "Beton, semen, ... (16)")
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

/**
 * Membersihkan string dari spasi, tanda baca, dan mengubahnya menjadi huruf kecil.
 * Digunakan untuk pencocokan string deskriptif penuh yang toleran terhadap inkonsistensi format.
 */
function normalizeString(input: string | undefined): string {
    if (!input) return '';
    // Normalisasi Unicode (NFD) untuk menyatukan karakter
    const normalizedInput = input.normalize('NFD');
    
    // Hapus diacritical marks, spasi, koma, titik, tanda hubung, dan tanda kurung, lalu ubah ke huruf kecil
    return normalizedInput.replace(/[\u0300-\u036f]/g, "") 
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

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: 'Gemini API key is missing' },
                { status: 500 }
            );
        }

        // Initialize Google GenAI
        const ai = new GoogleGenAI({
            apiKey: GEMINI_API_KEY,
        });

        // ====== TYPO CORRECTION WITH AI ======
        console.log(`🔍 Original query: "${query}"`);

        let correctedQuery = query;
        let hasCorrected = false;

        // Determine language for typo correction based on selectedLang
        const isIndonesian = selectedLang === 'IDN';
        const correctionLanguage = isIndonesian ? 'Indonesian' : 'English';

        try {
            const typoCheckPrompt = `
Analyze the following search query in ${correctionLanguage} language and check for typos or spelling mistakes.
If there are typos, correct them and return ONLY the corrected query in ${correctionLanguage}.
If there are no typos, return the original query exactly as is.

Query: "${query}"

Instructions:
- ONLY return the corrected word/phrase, nothing else
- Focus on ${correctionLanguage} language spelling and grammar
- If no correction needed, return the exact original query
- Do NOT add explanations or extra text
- Do NOT translate the query, only correct typos
`;

            const typoCheckResponse = await ai.models.generateContent({
                model: 'gemini-2.0-flash',
                config: {
                    responseModalities: ['TEXT'],
                    maxOutputTokens: 100,
                },
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: typoCheckPrompt }],
                    },
                ],
            });

            const suggestedQuery = typoCheckResponse.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

            if (suggestedQuery && suggestedQuery !== query && suggestedQuery.toLowerCase() !== query.toLowerCase()) {
                correctedQuery = suggestedQuery;
                hasCorrected = true;
                console.log(`✅ Typo corrected (${correctionLanguage}): "${query}" → "${correctedQuery}"`);
            } else {
                console.log(`✓ No typo detected in: "${query}" (${correctionLanguage})`);
            }
        } catch (typoError) {
            console.error('⚠️ Typo correction failed, using original query:', typoError);
        }

        // =================================================================
        // START: LANGUAGE SELECTION LOGIC
        // =================================================================
        // Use selectedLang directly from request
        const scopeData = isIndonesian ? scopeDataID : scopeDataEN;
        const language = isIndonesian ? 'Indonesian' : 'English';
        // =================================================================
        // END: LANGUAGE SELECTION LOGIC
        // =================================================================

        console.log(`🌐 Selected language: ${language} (${selectedLang})`);
        console.log(`📂 Using scope data: scope_${isIndonesian ? 'id' : 'en'}.json`);

        // --- DIRECT SEARCH LOGIC ---
        function searchInScopeData(keyword: string) {
            const results: AIResultItem[] = [];
            const trimmedKeyword = keyword.trim();
            const wordCount = trimmedKeyword.split(/\s+/).length;
            const isSingleWord = wordCount === 1;
            const isPhrase = wordCount >= 2;

            if (!trimmedKeyword) return results;

            console.log(`🔍 Attempting direct search for: "${trimmedKeyword}" (${isSingleWord ? 'single word' : 'phrase'})`);

            // Common words to filter out (Indonesian and English)
            const stopWords = [
                // Question words
                'apa', 'apa?', 'siapa', 'dimana', 'kapan', 'bagaimana', 'kenapa', 'berapa',
                'what', 'what?', 'who', 'where', 'when', 'how', 'why', 'which',
                // Generic words
                'perusahaan', 'kami', 'kita', 'saya', 'yang', 'dengan', 'dari', 'untuk',
                'adalah', 'ini', 'itu', 'tersebut', 'cocok', 'sesuai', 'tepat', 'baik',
                'scope', 'bahan', 'jasa', 'layanan', 'industri', 'usaha', 'bidang',
                'company', 'we', 'us', 'our', 'that', 'this', 'with', 'from', 'for',
                'is', 'suitable', 'appropriate', 'good', 'service', 'industry', 'business', 'field',
                // Auxiliary verbs
                'akan', 'sudah', 'telah', 'sedang', 'bisa', 'dapat', 'harus', 'ingin', 'mau', 'perlu',
                'will', 'have', 'has', 'had', 'being', 'can', 'could', 'should', 'want', 'need'
            ];

            // Tokenize phrase and remove stop words
            const searchWords = isPhrase
                ? trimmedKeyword.toLowerCase().split(/\s+/).filter(word => !stopWords.includes(word) && word.length > 2)
                : [trimmedKeyword.toLowerCase()];

            console.log(`🔍 Search tokens after filtering: [${searchWords.join(', ')}]`);

            // If no meaningful keywords left after filtering, return empty results
            if (searchWords.length === 0 || (searchWords.length === 1 && searchWords[0].length <= 2)) {
                console.log(`⚠️ No meaningful keywords found after filtering stop words`);
                return results;
            }

            const searchRegex = isSingleWord
                ? new RegExp(`\\b${trimmedKeyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i')
                : null;

            // Create regex for each search word
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

                                // Ekstraksi kode murni untuk Direct Search jika keyword adalah kode (mis. "16")
                                const extractedIAF = iafText.match(/\(([^()]+)\)/)?.[1]?.trim() || iafText;

                                let matched = false;
                                let iafMatchCount = 0;
                                let naceMatchCount = 0;
                                let naceChildMatchCount = 0;
                                let titleMatchCount = 0;
                                let descMatchCount = 0;

                                if (isSingleWord && searchRegex) {
                                    // Single word matching with word boundary
                                    const isIafCodeExact = extractedIAF === trimmedKeyword.toUpperCase();

                                    if (isIafCodeExact || iafText.match(searchRegex)) { iafMatchCount = 1; matched = true; }
                                    if (naceText.match(searchRegex)) { naceMatchCount = 1; matched = true; }
                                    if (naceChildText.match(searchRegex)) { naceChildMatchCount = 1; matched = true; }
                                    if (titleText.match(searchRegex)) { titleMatchCount = 1; matched = true; }
                                    if (descText.match(searchRegex)) { descMatchCount = 1; matched = true; }

                                    if (!matched) {
                                        // Fallback pencocokan kode murni
                                        if (extractedIAF === trimmedKeyword) { iafMatchCount = 1; matched = true; }
                                        if (naceDetail.NACE.code === trimmedKeyword) { naceMatchCount = 1; matched = true; }
                                        if (naceChild.code === trimmedKeyword) { naceChildMatchCount = 1; matched = true; }
                                        if (childDetail.code === trimmedKeyword) { titleMatchCount = 1; matched = true; }
                                    }
                                } else if (isPhrase && searchWords.length > 0) {
                                    // Phrase matching: count how many search words match in each field
                                    for (const regex of wordRegexes) {
                                        if (iafText.match(regex)) iafMatchCount++;
                                        if (naceText.match(regex)) naceMatchCount++;
                                        if (naceChildText.match(regex)) naceChildMatchCount++;
                                        if (titleText.match(regex)) titleMatchCount++;
                                        if (descText.match(regex)) descMatchCount++;
                                    }

                                    // Consider it a match if at least one word matched
                                    if (iafMatchCount > 0 || naceMatchCount > 0 || naceChildMatchCount > 0 ||
                                        titleMatchCount > 0 || descMatchCount > 0) {
                                        matched = true;
                                    }
                                }

                                if (matched) {
                                    // Calculate score based on number of words matched and field importance
                                    const score =
                                        (iafMatchCount * 30) +
                                        (naceMatchCount * 20) +
                                        (naceChildMatchCount * 15) +
                                        (titleMatchCount * 10) +
                                        (descMatchCount * 25);

                                    results.push({
                                        scope_key: scopeKey,
                                        // IAF_CODE DARI DATA SUMBER (DESKRIPTIF PENUH)
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
        const canUseDirectSearch = trimmedQuery.length > 0;
        let directSearchResults: AIResultItem[] = [];

        if (canUseDirectSearch) {
            directSearchResults = searchInScopeData(correctedQuery);
            console.log(`🔍 Direct search found ${directSearchResults.length} matches for "${correctedQuery}"`);
        }

        // --- DIRECT SEARCH RESULT PROCESSING ---
        if (directSearchResults.length > 0) {
            console.log(`✅ Using direct search results (${directSearchResults.length} matches)`);
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

            // Lower threshold for direct search (20) because it's already precise
            const detailedResults = Object.values(groupedResults).filter(r => r.relevance_score >= 20 && r.nace_child_details.length > 0);
            detailedResults.sort((a, b) => b.relevance_score - a.relevance_score);

            console.log(`📦 Grouped into ${detailedResults.length} result cards (Direct Search)`);

            // Build detailed explanation with IAF and NACE Child information
            let penjelasan = '';
            if (hasCorrected) {
                penjelasan = isIndonesian
                    ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
                    : `We detected a possible typo in your search. Search "${query}" has been corrected to "${correctedQuery}".\n\n`;
            }

            // Get top results (top 10 or results with score >= 70%)
            const topResults = detailedResults.filter(r => r.relevance_score >= 70).slice(0, 15);
            const resultsToShow = topResults.length > 0 ? topResults : detailedResults.slice(0, 15);

            // Group results by standar only
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

                // Add or update IAF item
                const iafKey = result.iaf_code;
                if (!explanationGroups[groupKey].iaf_items.has(iafKey)) {
                    explanationGroups[groupKey].iaf_items.set(iafKey, {
                        iaf_code: result.iaf_code,
                        nace_items: new Map()
                    });
                }

                // Add or update NACE item within IAF
                const naceKey = result.nace.code;
                const iafItem = explanationGroups[groupKey].iaf_items.get(iafKey)!;
                if (!iafItem.nace_items.has(naceKey)) {
                    iafItem.nace_items.set(naceKey, {
                        nace_code: result.nace.code,
                        nace_description: result.nace.description,
                        nace_children: new Set()
                    });
                }

                // Add NACE Child code (parent code, e.g., 23.5 from 23.51)
                if (result.nace_child?.code) {
                    iafItem.nace_items.get(naceKey)!.nace_children.add(result.nace_child.code);
                }

                // Update max score
                if (result.relevance_score > explanationGroups[groupKey].max_score) {
                    explanationGroups[groupKey].max_score = result.relevance_score;
                }
            }

            const groupedForExplanation = Object.values(explanationGroups);

            penjelasan += isIndonesian
                ? `Ditemukan ${detailedResults.length} kategori scope yang sesuai dengan pencarian "${correctedQuery}". Berikut adalah scope dengan relevansi tertinggi:\n\n`
                : `Found ${detailedResults.length} scope categories matching "${correctedQuery}". Here are scopes with highest relevance:\n\n`;

            // Add simplified breakdown
            groupedForExplanation.forEach((group, idx) => {
                penjelasan += isIndonesian
                    ? `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`
                    : `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`;

                // List all IAF items in this standard
                Array.from(group.iaf_items.values()).forEach(iafItem => {
                    penjelasan += `IAF: ${iafItem.iaf_code}\n\n`;

                    // List all NACE items in this IAF
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
                ? `Hasil yang diperoleh diatas, bukan merupakan hasil akhir dari penetapan ruang lingkup,tetapi perlu diuji oleh auditor dengan bukti lainnya seperti legalitas dan aktivitas organisasi. Anda dapat mengklik kode NACE Child di bagian ringkasan untuk langsung melihat detail scope tersebut. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.`
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
        // Main Path: Semantic Search dengan AI
        // =====================================================================================
        console.log(`⚠️ Direct results not found or query is complex, falling back to AI semantic search`);

        // Prepare the data for AI analysis
        const scopeContext = JSON.stringify(scopeData, (key, value) => {
            if (key === 'description' && typeof value === 'string') return undefined;
            if (key === 'nace_child_detail') return value;
            if (key === 'NACE_CHILD_DETAIL') return value;
            return value;
        }, 2);

        // PROMPT DENGAN INSTRUKSI UNTUK ANALISIS KONTEKSTUAL
        const prompt = `
You are an expert certification scope analyst. Your task is to analyze user queries and find the most relevant certification scopes.

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

After filtering, the extracted keywords should be: [list only the meaningful keywords]

**EXAMPLE:**
- Query: "perusahaan kami memproduksi rambut dengan bahan plastik, scope apa yang cocok?"
- Filtered Keywords: ["memproduksi", "rambut", "plastik"]
- Keywords to IGNORE: ["perusahaan", "kami", "dengan", "bahan", "scope", "apa", "yang", "cocok"]

### Step 2: Semantic Mapping Rules
Use ONLY the filtered keywords for matching. DO NOT search for ignored words like "apa", "perusahaan", "kami", etc.

- If the query mentions **"memproduksi/membuat + rambut + plastik"** (produce plastic hair), map to:
  * PRIMARY: Plastic products manufacturing (IAF code: Manufacture of plastic products)
  * SECONDARY: Textile products (if applicable)
- If the query mentions **production/manufacturing + material**, focus on:
  * The final product category (e.g., plastic products, textile products)
  * The manufacturing process category
- For **compound products** (e.g., "plastic hair", "rubber shoes"), consider BOTH:
  * Material-based scope (e.g., plastic manufacturing)
  * Product-based scope (e.g., hair accessories, footwear)

### Step 3: Search Strategy
**CRITICAL: Search ONLY using the filtered keywords. DO NOT match words like "apa", "yang", "dengan", etc.**

1. Search across ALL fields: IAF_CODE, NACE descriptions, NACE_CHILD descriptions, nace_child_detail_description
2. Use ONLY meaningful keywords (activity verbs, product nouns, material nouns)
3. Consider synonyms and related terms (e.g., "plastik" = "plastic", "sintetis" = "synthetic", "memproduksi" = "manufacture")
4. Look for both specific matches and broader category matches
5. **REJECT any match that only contains ignored words** (e.g., if scope only matches "apa" but not "plastik" or "rambut", REJECT it)

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
- **ONLY return results that match meaningful keywords** (activity verbs, product nouns, material nouns)
- **REJECT results that only match ignored words** like "apa", "yang", "perusahaan", "kami", "dengan", etc.
- Return ALL results with score >= 50 (that match meaningful keywords)
- Sort by relevance_score (highest first)
- Response MUST be valid JSON format
- In "penjelasan", explain your reasoning and mention which keywords were used for matching
- In "saran", provide practical advice for scope selection

**VALIDATION CHECK before returning results:**
For each result, verify that it matches at least ONE meaningful keyword (not just ignored words).
Example: If result only contains "apa" but not "plastik" or "rambut", DO NOT include it.
`;

        let aiResult: AIResponse | undefined;
        let attempt = 0;
        const maxRetries = 3;

        while (attempt < maxRetries) {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-2.0-flash',
                    config: {
                        responseMimeType: 'application/json',
                        responseSchema: {
                            type: 'OBJECT',
                            properties: {
                                hasil_pencarian: {
                                    type: 'ARRAY',
                                    items: {
                                        type: 'OBJECT',
                                        properties: {
                                            scope_key: { type: 'STRING' },
                                            iaf_code: { type: 'STRING' },
                                            nace_code: { type: 'STRING' },
                                            nace_child_code: { type: 'STRING' },
                                            nace_child_detail_code: { type: 'STRING' },
                                            relevance_score: { type: 'NUMBER' }
                                        },
                                        required: ['scope_key', 'iaf_code', 'nace_code', 'nace_child_code', 'nace_child_detail_code', 'relevance_score']
                                    }
                                },
                                penjelasan: { type: 'STRING' },
                                saran: { type: 'STRING' }
                            },
                            required: ['hasil_pencarian', 'penjelasan', 'saran']
                        },
                        temperature: 0.1,
                        maxOutputTokens: 8192,
                    },
                    contents: [
                        {
                            role: 'user',
                            parts: [
                                { text: prompt },
                            ],
                        },
                    ],
                });

                const aiResponseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (!aiResponseText) {
                    console.error(`AI returned empty response on attempt ${attempt + 1}`);
                } else {
                    let cleanedText = aiResponseText.trim();
                    if (cleanedText.startsWith('```json')) {
                        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                    } else if (cleanedText.startsWith('```')) {
                        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
                    }
                    
                    aiResult = JSON.parse(cleanedText) as AIResponse;
                    
                    if (aiResult.hasil_pencarian && Array.isArray(aiResult.hasil_pencarian)) {
                        break; // Success
                    }
                }

            } catch (error) {
                console.error(`Error processing AI response on attempt ${attempt + 1}:`, error);
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

        console.log(`📊 AI returned ${aiResult.hasil_pencarian.length} results (Semantic Search)`);

        const groupedResults: Record<string, GroupedResult> = {};

        for (const result of aiResult.hasil_pencarian) {
            const aiScopeKey = result.scope_key;
            
            // 1. Cari key yang benar (case-insensitive) di scopeData
            const actualScopeKey = Object.keys(scopeData).find(
                key => key.toLowerCase() === aiScopeKey.toLowerCase()
            ) as keyof typeof scopeData;

            if (!actualScopeKey) {
                console.warn(`[Grouping Skip] Scope key '${aiScopeKey}' not found in source data (Case mismatch or invalid key).`);
                continue;
            }
            
            const scopeInfo = scopeData[actualScopeKey];

            // 2. Ambil IAF Code dari AI dan Normalisasi AGRESIF
            const aiIAFCodeNormalized = normalizeString(result.iaf_code); 
            
            // 3. Gunakan IAF code yang sudah dinormalisasi untuk mencari di data sumber
            const iafScope = scopeInfo.scope.find(s => {
                // Normalisasi IAF CODE dari data sumber sebelum dibandingkan
                const dataIAFCodeNormalized = normalizeString(s.IAF_CODE);
                // Pencocokan string yang ketat setelah normalisasi
                return dataIAFCodeNormalized === aiIAFCodeNormalized; 
            });
            
            if (!iafScope || !Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) {
                // Warning ini menunjukkan IAF code deskriptif tidak ditemukan (meski dinormalisasi)
                console.warn(`[Grouping Skip] IAF code '${result.iaf_code}' failed strict normalization matching in scope ${actualScopeKey}.`);
                continue;
            }

            // Periksa naceDetail: pastikan NACE ada dan NACE_CHILD adalah array
            const naceDetail = iafScope.NACE_DETAIL_INFORMATION.find(n => n.NACE && n.NACE.code === result.nace_code);  
            if (!naceDetail || typeof naceDetail !== 'object' || !('NACE' in naceDetail) || !Array.isArray(naceDetail.NACE_CHILD)) {
                 console.warn(`[Grouping Skip] NACE detail structure error: ${result.nace_code}`);
                continue;
            }

            // Periksa naceChild
            const naceChild = naceDetail.NACE_CHILD.find(nc => nc.code === result.nace_child_code);
            if (!naceChild) {
                console.warn(`[Grouping Skip] NACE Child code not found: ${result.nace_child_code}`);
                continue;
            }

            // Dapatkan detail anak
            const childDetails =
                "nace_child_detail" in naceChild
                ? naceChild.nace_child_detail
                : "NACE_CHILD_DETAIL" in naceChild
                ? naceChild.NACE_CHILD_DETAIL
                : undefined;

            if (!Array.isArray(childDetails)) continue;

            // Periksa apakah nace_child_detail_code dari AI benar-benar ada di data sumber
            const detailResult = childDetails.find(cd => cd.code === result.nace_child_detail_code);
            if (!detailResult) {
                 console.warn(`[Grouping Skip] AI suggested NACE Detail Code NOT FOUND in source data: ${result.nace_child_detail_code}`);
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

            // Tambahkan detail anak ke grup, dengan detail yang direferensikan AI di paling atas
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

        // Ambil hasil yang dikelompokkan dengan skor minimal 50
        const detailedResults = Object.values(groupedResults).filter(r => r.relevance_score >= 50 && r.nace_child_details.length > 0);
        detailedResults.sort((a, b) => b.relevance_score - a.relevance_score);

        console.log(`📦 Grouped into ${detailedResults.length} result cards (Semantic Search)`);

        // Build detailed explanation with IAF and NACE Child information
        let penjelasan = '';
        if (hasCorrected) {
            penjelasan = isIndonesian
                ? `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`
                : `We detected a possible typo in your search. Search "${query}" has been corrected to "${correctedQuery}".\n\n`;
        }

        // Add AI explanation first
        penjelasan += aiResult.penjelasan + '\n\n';

        // Get top results (top 15 or results with score >= 70%)
        const topResults = detailedResults.filter(r => r.relevance_score >= 70).slice(0, 15);
        const resultsToShow = topResults.length > 0 ? topResults : detailedResults.slice(0, 15);

        // Group results by standar only
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

            // Add or update IAF item
            const iafKey = result.iaf_code;
            if (!explanationGroups[groupKey].iaf_items.has(iafKey)) {
                explanationGroups[groupKey].iaf_items.set(iafKey, {
                    iaf_code: result.iaf_code,
                    nace_items: new Map()
                });
            }

            // Add or update NACE item within IAF
            const naceKey = result.nace.code;
            const iafItem = explanationGroups[groupKey].iaf_items.get(iafKey)!;
            if (!iafItem.nace_items.has(naceKey)) {
                iafItem.nace_items.set(naceKey, {
                    nace_code: result.nace.code,
                    nace_description: result.nace.description,
                    nace_children: new Set()
                });
            }

            // Add NACE Child code (parent code, e.g., 23.5 from 23.51)
            if (result.nace_child?.code) {
                iafItem.nace_items.get(naceKey)!.nace_children.add(result.nace_child.code);
            }

            // Update max score
            if (result.relevance_score > explanationGroups[groupKey].max_score) {
                explanationGroups[groupKey].max_score = result.relevance_score;
            }
        }

        const groupedForExplanation = Object.values(explanationGroups);

        penjelasan += isIndonesian
            ? `**Scope dengan Relevansi Tertinggi:**\n\n`
            : `**Scopes with Highest Relevance:**\n\n`;

        // Add simplified breakdown
        groupedForExplanation.forEach((group, idx) => {
            penjelasan += isIndonesian
                ? `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`
                : `**${idx + 1}. ${group.standar}** (${group.max_score}%)\n\n`;

            // List all IAF items in this standard
            Array.from(group.iaf_items.values()).forEach(iafItem => {
                penjelasan += `IAF: ${iafItem.iaf_code}\n\n`;

                // List all NACE items in this IAF
                Array.from(iafItem.nace_items.values()).forEach(naceItem => {
                    const childCodes = Array.from(naceItem.nace_children).sort();
                    penjelasan += `NACE Code (${naceItem.nace_code}): ${naceItem.nace_description}\n`;
                    penjelasan += `NACE Child: ${childCodes.join(', ')}\n\n`;
                });
            });
        });

        penjelasan += isIndonesian
            ? `Total ${detailedResults.length} hasil ditemukan. Semua hasil ditampilkan berdasarkan tingkat relevansi tertinggi ke terendah. (Menggunakan AI Semantic Search)`
            : `Total ${detailedResults.length} results found. All results are displayed from highest to lowest relevance. (Using AI Semantic Search)`;

        // Enhance saran with clickable link instruction
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