import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import scopeDataEN from '@/lib/scope_en.json';
import scopeDataID from '@/lib/scope_id.json';

// Tambahkan ini di bagian atas file (setelah import)
type NaceChildDetail = {
  code: string;
  title?: string;
  nace_child_detail_description?: string;
  description?: string; // 👈 tambahkan ini
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

// NEW TYPES TO RESOLVE: Error: Unexpected any. Specify a different type.
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

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

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

    try {
      const typoCheckPrompt = `
Analyze the following search query and check for typos or spelling mistakes.
If there are typos, correct them and return ONLY the corrected query.
If there are no typos, return the original query exactly as is.

Context: This is for searching industrial/business scope certifications (ISO, manufacturing, services, etc.)

Common words in this domain (Indonesian & English):
- transportasi/transport, kendaraan/vehicle, otomotif/automotive
- pertanian/agriculture, perikanan/fishery, kehutanan/forestry
- manufaktur/manufacturing, produksi/production
- teknologi/technology, informasi/information
- konstruksi/construction, bangunan/building
- kesehatan/health, pendidikan/education
- keuangan/finance, perbankan/banking

Query: "${query}"

Instructions:
- ONLY return the corrected word/phrase, nothing else
- If no correction needed, return the exact original query
- Do NOT add explanations or extra text
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
        console.log(`✅ Typo corrected: "${query}" → "${correctedQuery}"`);
      } else {
        console.log(`✓ No typo detected in: "${query}"`);
      }
    } catch (typoError) {
      console.error('⚠️ Typo correction failed, using original query:', typoError);
    }

    // =================================================================
    // START: REVISED LANGUAGE DETECTION LOGIC
    // =================================================================
    const correctedLower = correctedQuery.toLowerCase();
    
    // Kata kunci bahasa Inggris yang kuat, yang sering digunakan dalam konteks bisnis/teknis.
    const englishKeywords = ['industrial', 'cement', 'factory', 'manufacture', 'service', 'for', 'the', 'company', 'and', 'or', 'in', 'of', 'sector', 'business'];
    
    const indonesianKeywords = ['yang', 'dan', 'atau', 'adalah', 'untuk', 'dari', 'di', 'ke', 'pada', 'dengan', 'ini', 'itu', 'saya', 'perusahaan', 'produksi', 'jasa', 'kegiatan', 'layanan', 'bergerak', 'bidang'];
    
    const countIndonesian = indonesianKeywords.filter(kw => correctedLower.includes(kw)).length;
    const countEnglish = englishKeywords.filter(kw => correctedLower.includes(kw)).length;

    let isIndonesian: boolean;

    if (countIndonesian > countEnglish && countIndonesian > 0) {
        // Jika kata kunci Indonesia lebih dominan
        isIndonesian = true;
    } else if (countEnglish > countIndonesian && countEnglish > 0) {
        // Jika kata kunci Inggris lebih dominan
        isIndonesian = false;
    } else {
        // Fallback: cek berdasarkan set bahasa umum yang lebih luas
        const commonEnglishWords = correctedLower.split(/\s+/).filter(w => w.length > 3 && englishKeywords.some(ew => w.includes(ew))).length;
        const commonIndonesianWords = correctedLower.split(/\s+/).filter(w => w.length > 3 && indonesianKeywords.some(iw => w.includes(iw))).length;

        if (commonEnglishWords > commonIndonesianWords) {
            isIndonesian = false;
        } else {
            // Default ke Indonesia jika imbang/tidak terdeteksi jelas
            isIndonesian = true;
        }
    }
    
    // Select appropriate scope data based on language
    const scopeData = isIndonesian ? scopeDataID : scopeDataEN;
    const language = isIndonesian ? 'Indonesian' : 'English';
    // =================================================================
    // END: REVISED LANGUAGE DETECTION LOGIC
    // =================================================================

    console.log(`🌐 Detected language: ${language}`);
    console.log(`📂 Using scope data: scope_${isIndonesian ? 'id' : 'en'}.json`);

    // Fungsi untuk mencari langsung di scopeData (untuk pencarian 1 kata)
    function searchInScopeData(keyword: string) {
      const results: {
        scope_key: string;
        iaf_code: string;
        nace_code: string;
        nace_child_code: string;
        nace_child_detail_code: string;
        relevance_score: number;
      }[] = [];

      const isSingleWord = keyword.trim().split(/\s+/).length === 1;
      const searchKeywords = isSingleWord ? [keyword.toLowerCase().trim()] : [];

      if (searchKeywords.length === 0) return results;

      const kw = searchKeywords[0];
      console.log(`🔍 Attempting direct search for single keyword: [${kw}]`);
      
      // PERBAIKAN UTAMA: Menggunakan regex dengan word boundaries (\b)
      // Ini memastikan hanya kata "kw" utuh yang cocok, bukan substring seperti "cement" di "placement".
      const searchRegex = new RegExp(`\\b${kw.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');


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
                
                // Cek apakah IAF_CODE adalah kata kunci itu sendiri (e.g., kw = '17')
                const isIafCodeExact = iafScope.IAF_CODE === kw.toUpperCase();

                let matched = false;
                let iafMatch = false;
                let naceMatch = false;
                let naceChildMatch = false;
                let titleMatch = false;
                let descMatch = false;
                
                // Gunakan regex untuk pencocokan kata utuh
                if (isIafCodeExact || iafText.match(searchRegex)) { iafMatch = true; matched = true; }
                if (naceText.match(searchRegex)) { naceMatch = true; matched = true; }
                if (naceChildText.match(searchRegex)) { naceChildMatch = true; matched = true; }
                if (titleText.match(searchRegex)) { titleMatch = true; matched = true; }
                if (descText.match(searchRegex)) { descMatch = true; matched = true; }
                
                // Fallback untuk pencarian kode (jika kode dimasukkan sebagai kata kunci)
                if (!matched) {
                    if (iafScope.IAF_CODE === kw) { iafMatch = true; matched = true; }
                    if (naceDetail.NACE.code === kw) { naceMatch = true; matched = true; }
                    if (naceChild.code === kw) { naceChildMatch = true; matched = true; }
                    if (childDetail.code === kw) { titleMatch = true; matched = true; }
                }
                
                if (matched) {
                  const score =
                    (iafMatch ? 30 : 0) +
                    (naceMatch ? 20 : 0) +
                    (naceChildMatch ? 15 : 0) +
                    (titleMatch ? 10 : 0) +
                    (descMatch ? 25 : 0);

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
    
    const isSingleWordQuery = correctedQuery.trim().split(/\s+/).length === 1 && correctedQuery.trim().length > 0;

    let directSearchResults: ReturnType<typeof searchInScopeData> = [];

    if (isSingleWordQuery) {
      directSearchResults = searchInScopeData(correctedQuery);
      console.log(`🔍 Direct search found ${directSearchResults.length} matches for "${correctedQuery}"`);
    }

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

      const detailedResults = Object.values(groupedResults).filter(r => r.relevance_score >= 50 && r.nace_child_details.length > 0);
      detailedResults.sort((a, b) => b.relevance_score - a.relevance_score);


      console.log(`📦 Grouped into ${detailedResults.length} result cards (Direct Search)`);
      
      let penjelasan = '';
      if (hasCorrected) {
        penjelasan = `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`;
      }
      penjelasan += `Ditemukan ${detailedResults.length} kategori scope yang mengandung kata "${correctedQuery}". Hasil ditampilkan berdasarkan tingkat relevansi, dengan yang paling sesuai ditampilkan terlebih dahulu. (Menggunakan Pencarian Cepat)`;

      return NextResponse.json({
        hasil_pencarian: detailedResults,
        penjelasan: penjelasan,
        saran: `Periksa setiap kategori untuk menemukan scope yang paling sesuai dengan kegiatan perusahaan Anda. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.`,
        total_hasil: detailedResults.length,
        query: query,
        corrected_query: hasCorrected ? correctedQuery : undefined
      });
    }

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

    // PROMPT DENGAN INSTRUKSI KETAT UNTUK STABILITAS DAN RELEVANSI
    const prompt = `
Your Task (in ${language}):
1. Analyze the user's query: "${correctedQuery}". Focus on keywords like **cement** and **refractory/fireproof**.
2. Find ALL relevant scope, IAF_CODE, NACE, NACE_CHILD, and nace_child_detail based on the provided scope data.
3. Search in ALL levels (IAF_CODE, NACE descriptions, nace_child_detail_description).
4. **STABILITY & RELEVANCE RULE (MANDATORY)**: For the **cement/concrete** industry, you MUST include relevant entries from IAF (16), specifically **NACE 23.5** (Manufacture of cement, lime, and plaster) AND **NACE 23.6** (Manufacture of concrete, plaster, and cement products). Assign high scores (minimum 90 for a strong match) as these are complementary industry categories.
5. DO NOT limit the number of results. RETURN ALL results with reasonable relevance (score minimum 50).
6. Sort by the highest relevance score.
7. Provide the explanation in **${language}**.

Data Scope:
${scopeContext}

User Query: "${correctedQuery}"

IMPORTANT RULES for JSON Output:
- Ensure every entry in "hasil_pencarian" correctly references a valid IAF_CODE and nace_child_detail_code from the Data Scope.
- Return ALL relevant results.
- Assign relevance_score (50-100).
- The entire response MUST be valid JSON format.
`;

    let aiResult: AIResponse | undefined; // FIX: Replaced 'any' with 'AIResponse | undefined'
    let aiResponseText: string | undefined;
    const maxRetries = 3;
    let attempt = 0;

    // Perbaikan: Menggunakan responseMimeType dan temperature rendah untuk stabilitas
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
                    temperature: 0.1, // Rendahkan suhu untuk hasil yang lebih deterministik (stabil)
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

            aiResponseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!aiResponseText) {
                console.error(`AI returned empty response on attempt ${attempt + 1}`);
            } else {
                // Bersihkan dan parse JSON
                let cleanedText = aiResponseText.trim();
                if (cleanedText.startsWith('```json')) {
                    cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
                } else if (cleanedText.startsWith('```')) {
                    cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
                }
                
                // FIX: Use type assertion to avoid 'any' explicitly
                aiResult = JSON.parse(cleanedText) as AIResponse;
                
                // Validasi sukses
                if (aiResult.hasil_pencarian && Array.isArray(aiResult.hasil_pencarian)) {
                    break; // Berhasil, keluar dari loop
                }
            }

        } catch (error) {
            console.error(`Error processing AI response on attempt ${attempt + 1}:`, error);
        }
        attempt++;
    }

    if (!aiResult || !Array.isArray(aiResult.hasil_pencarian)) {
        return NextResponse.json({
            hasil_pencarian: [],
            penjelasan: `Terjadi kesalahan internal dalam memproses respons AI. Mohon coba kata kunci yang berbeda. Query: "${correctedQuery}"`,
            saran: "Silakan coba dengan kata kunci yang lebih spesifik",
            query: query
        }, { status: 500 });
    }

    console.log(`📊 AI returned ${aiResult.hasil_pencarian.length} results (Semantic Search)`);

    // Group results logic (sama seperti sebelumnya)
    const groupedResults: Record<string, GroupedResult> = {};

    for (const result of aiResult.hasil_pencarian) {
      const scopeKey = result.scope_key as keyof typeof scopeData;
      const scopeInfo = scopeData[scopeKey];

      if (!scopeInfo) continue;

      const iafScope = scopeInfo.scope.find(s => s.IAF_CODE === result.iaf_code);
      if (!iafScope || !Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

      const naceDetail = iafScope.NACE_DETAIL_INFORMATION.find(n => n.NACE && n.NACE.code === result.nace_code);
      if (!naceDetail || typeof naceDetail !== 'object' || !('NACE' in naceDetail) || !Array.isArray(naceDetail.NACE_CHILD)) continue;

      const naceChild = naceDetail.NACE_CHILD.find(nc => nc.code === result.nace_child_code);
      if (!naceChild) continue;

      const childDetails =
        "nace_child_detail" in naceChild
          ? naceChild.nace_child_detail
          : "NACE_CHILD_DETAIL" in naceChild
          ? naceChild.NACE_CHILD_DETAIL
          : undefined;

      if (!Array.isArray(childDetails)) continue;

      const detailResult = childDetails.find(cd => cd.code === result.nace_child_detail_code);
      if (!detailResult) {
          console.warn(`Skipping result: AI suggested code ${result.nace_child_detail_code} not found in source data.`);
          continue;
      }

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

    console.log(`📦 Grouped into ${detailedResults.length} result cards (Semantic Search)`);

    let penjelasan = '';
    if (hasCorrected) {
      penjelasan = `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`;
    }
    penjelasan += aiResult.penjelasan;

    return NextResponse.json({
      hasil_pencarian: detailedResults,
      penjelasan: penjelasan,
      saran: aiResult.saran,
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