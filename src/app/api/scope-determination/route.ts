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

type NaceChild = {
  code: string;
  nace_child_title?: string;
  nace_child_detail?: NaceChildDetail[];
  NACE_CHILD_DETAIL?: NaceChildDetail[];
};

type NaceDetail = {
  NACE: { code: string; nace_description: string };
  NACE_CHILD: NaceChild[];
};

type IafScope = {
  IAF_CODE: string;
  NACE_DETAIL_INFORMATION: NaceDetail[];
};

// type ScopeValue = {
//   standar: string;
//   scope: IafScope[];
// };

type GroupedResult = {
  scope_key: string;
  standar: string;
  iaf_code: string;
  nace: { code: string; description: string };
  nace_child: { code: string; title?: string };
  nace_child_details: NaceChildDetail[];
  relevance_score: number;
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
- Examples:
  * "trasnport" → "transport"
  * "transportsi" → "transportasi"
  * "otmotif" → "otomotif"
  * "kesehatn" → "kesehatan"
  * "transport" → "transport" (no change if already correct)
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
      // If typo correction fails, continue with original query
    }

    // Detect language from query (using corrected query)
    const indonesianKeywords = ['yang', 'dan', 'atau', 'adalah', 'untuk', 'dari', 'di', 'ke', 'pada', 'dengan', 'ini', 'itu', 'saya', 'perusahaan', 'produksi', 'jasa', 'kegiatan', 'layanan', 'bergerak', 'bidang'];
    const indonesianWords = [
      'pertanian', 'kehutanan', 'perikanan', 'konstruksi', 'manufaktur', 'perdagangan', 'pendidikan', 'kesehatan', 'keuangan', 'transportasi', 'telekomunikasi', 'perkebunan', 'peternakan', 'pengolahan', 'pabrik', 'restoran', 'teknologi', 'informasi',
      'kendaraan', 'otomotif', 'tekstil', 'pakaian', 'makanan', 'minuman', 'logam', 'plastik', 'kimia', 'elektronik', 'mesin', 'peralatan', 'furniture', 'kayu', 'kertas', 'percetakan', 'penerbitan', 'bangunan', 'properti', 'semen', 'beton', 'baja', 'aluminium',
      'pertambangan', 'minyak', 'gas', 'listrik', 'air', 'limbah', 'daur', 'ulang', 'hotel', 'pariwisata', 'komunikasi', 'perbankan', 'asuransi', 'konsultan', 'hukum', 'akuntansi', 'arsitektur', 'desain', 'penelitian', 'pengembangan', 'pemasaran', 'periklanan',
      'rumah', 'sakit', 'klinik', 'apotek', 'laboratorium', 'farmasi', 'sekolah', 'universitas', 'pelatihan', 'perpustakaan', 'museum', 'bioskop', 'olahraga', 'hiburan', 'seni', 'budaya', 'kerajinan', 'mainan',
      // Additional Indonesian words
      'sarana', 'prasarana', 'infrastruktur', 'fasilitas', 'pelayanan', 'angkutan', 'pengangkutan', 'distribusi', 'penyimpanan', 'gudang', 'pergudangan',
      'pengelolaan', 'pemeliharaan', 'perbaikan', 'pembuatan', 'perakitan', 'penjualan', 'pembelian', 'perdagangan', 'ekspor', 'impor',
      'industri', 'usaha', 'bisnis', 'dagang', 'niaga', 'toko', 'warung', 'bengkel', 'perbengkelan', 'servis', 'reparasi'
    ];

    const hasIndonesianKeyword = indonesianKeywords.some(keyword =>
      correctedQuery.toLowerCase().includes(` ${keyword} `) ||
      correctedQuery.toLowerCase().startsWith(`${keyword} `) ||
      correctedQuery.toLowerCase().endsWith(` ${keyword}`) ||
      correctedQuery.toLowerCase() === keyword
    );

    const hasIndonesianWord = indonesianWords.some(word =>
      correctedQuery.toLowerCase().includes(word)
    );

    const isIndonesian = hasIndonesianKeyword || hasIndonesianWord;

    // Select appropriate scope data based on language
    const scopeData = isIndonesian ? scopeDataID : scopeDataEN;
    const language = isIndonesian ? 'Indonesian' : 'English';

    console.log(`🌐 Detected language: ${language}`);
    console.log(`📂 Using scope data: scope_${isIndonesian ? 'id' : 'en'}.json`);

    // Function to search directly in scopeData
    function searchInScopeData(keyword: string) {
      // const results: any[] = [];
      const results: {
        scope_key: string;
        iaf_code: string;
        nace_code: string;
        nace_child_code: string;
        nace_child_detail_code: string;
        relevance_score: number;
      }[] = [];


      // Stopwords to filter out (Indonesian & English)
      const stopwords = [
        // Indonesian stopwords
        'yang', 'dan', 'atau', 'adalah', 'untuk', 'dari', 'di', 'ke', 'pada',
        'dengan', 'ini', 'itu', 'saya', 'bergerak', 'menggunakan', 'bahan',
        'membuat', 'melakukan', 'perusahaan', 'kapal', 'laut', 'darat', 'udara',
        // English stopwords
        'the', 'a', 'an', 'and', 'or', 'for', 'of', 'in', 'to', 'on', 'with',
        'this', 'that', 'using', 'by', 'as', 'at', 'be', 'we', 'our', 'my',
        'create', 'make', 'do', 'have', 'has', 'company', 'business'
      ];

      // Split query into keywords and filter stopwords
      const keywords = keyword
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(word =>
          word.length >= 3 && // Min 3 characters
          !stopwords.includes(word) // Not a stopword
        );

      // If no valid keywords, use the whole query
      const searchKeywords = keywords.length > 0 ? keywords : [keyword.toLowerCase().trim()];

      console.log(`🔍 Searching for keywords: [${searchKeywords.join(', ')}]`);

      for (const [scopeKey, scopeValue] of Object.entries(scopeData)) {
        if (!scopeValue.scope || !Array.isArray(scopeValue.scope)) continue;

        for (const iafScope of scopeValue.scope) {
          if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

          for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
            if (!naceDetail?.NACE) continue;
            if (!Array.isArray(naceDetail.NACE_CHILD)) continue;

            for (const naceChild of naceDetail.NACE_CHILD) {
              // Periksa apakah properti yang digunakan ada
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

                let matchedKeywords = 0;
                let iafMatch = false;
                let naceMatch = false;
                let naceChildMatch = false;
                let titleMatch = false;
                let descMatch = false;

                for (const kw of searchKeywords) {
                  if (iafText.includes(kw)) { iafMatch = true; matchedKeywords++; }
                  else if (naceText.includes(kw)) { naceMatch = true; matchedKeywords++; }
                  else if (naceChildText.includes(kw)) { naceChildMatch = true; matchedKeywords++; }
                  else if (titleText.includes(kw)) { titleMatch = true; matchedKeywords++; }
                  else if (descText.includes(kw)) { descMatch = true; matchedKeywords++; }
                }

                if (matchedKeywords > 0) {
                  results.push({
                    scope_key: scopeKey,
                    iaf_code: iafScope.IAF_CODE,
                    nace_code: naceDetail.NACE.code,
                    nace_child_code: naceChild.code,
                    nace_child_detail_code: childDetail.code,
                    relevance_score:
                      (iafMatch ? 30 : 0) +
                      (naceMatch ? 25 : 0) +
                      (naceChildMatch ? 20 : 0) +
                      (titleMatch ? 15 : 0) +
                      (descMatch ? 10 : 0) +
                      matchedKeywords * 5,
                  });
                }
              }
            }

          }
        }
      }

      return results;
    }

    // Direct search in scopeData (using corrected query)
    const directSearchResults = searchInScopeData(correctedQuery);
    console.log(`🔍 Direct search found ${directSearchResults.length} matches for "${correctedQuery}"`);

    // If direct search found results, use them directly (faster and more accurate)
    if (directSearchResults.length > 0) {
      console.log(`✅ Using direct search results (${directSearchResults.length} matches)`);

      // Sort by relevance score
      directSearchResults.sort((a, b) => b.relevance_score - a.relevance_score);

      // Group results
      // const groupedResults: Record<string, any> = {};
      const groupedResults: Record<string, GroupedResult> = {};

      for (const result of directSearchResults) {
        const scopeKey = result.scope_key;
        const scopeInfo = scopeData[scopeKey as keyof typeof scopeData];

        if (!scopeInfo) continue;

        for (const iafScope of scopeInfo.scope) {
          if (result.iaf_code && iafScope.IAF_CODE !== result.iaf_code) continue;

          if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

          for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
            if (!naceDetail || typeof naceDetail !== 'object' || !('NACE' in naceDetail)) continue;
            if (result.nace_code && naceDetail.NACE.code !== result.nace_code) continue;

            if (!Array.isArray(naceDetail.NACE_CHILD)) continue;

            for (const naceChild of naceDetail.NACE_CHILD) {
              if (result.nace_child_code && naceChild.code !== result.nace_child_code) continue;

              // Handle dua kemungkinan nama properti
              const childDetails =
                "nace_child_detail" in naceChild
                  ? naceChild.nace_child_detail
                  : "NACE_CHILD_DETAIL" in naceChild
                  ? naceChild.NACE_CHILD_DETAIL
                  : undefined;

              if (!Array.isArray(childDetails)) continue;

              // Create unique key for grouping
              const groupKey = `${scopeKey}|${iafScope.IAF_CODE}|${naceDetail.NACE.code}|${naceChild.code}`;

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
                  relevance_score: result.relevance_score || 0,
                };
              }

              // Add ALL child details in this NACE Child group
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
                  // (d: any) => d.code === childDetail.code
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

          }
        }
      }

      const detailedResults = Object.values(groupedResults).filter(r => r.nace_child_details.length > 0);

      console.log(`📦 Grouped into ${detailedResults.length} result cards`);
      console.log(`📝 Total detail codes across all cards: ${detailedResults.reduce((sum, r) => sum + r.nace_child_details.length, 0)}`);

      // Build penjelasan with typo correction info
      let penjelasan = '';
      if (hasCorrected) {
        penjelasan = `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`;
      }
      penjelasan += `Ditemukan ${detailedResults.length} kategori scope yang mengandung kata "${correctedQuery}". Hasil ditampilkan berdasarkan tingkat relevansi, dengan yang paling sesuai ditampilkan terlebih dahulu.`;

      return NextResponse.json({
        hasil_pencarian: detailedResults,
        penjelasan: penjelasan,
        saran: `Periksa setiap kategori untuk menemukan scope yang paling sesuai dengan kegiatan perusahaan Anda. Anda dapat memilih lebih dari satu scope jika perusahaan memiliki berbagai jenis kegiatan.`,
        total_hasil: detailedResults.length,
        query: query,
        corrected_query: hasCorrected ? correctedQuery : undefined
      });
    }

    // Fallback to AI if direct search found nothing
    console.log(`⚠️ No direct results found, falling back to AI search`);

    // Prepare the data for AI analysis
    const scopeContext = JSON.stringify(scopeData, null, 2);

    const prompt = `
Tugas Anda:
1. Analisis maksud pencarian user: "${correctedQuery}"
2. Temukan SEMUA scope, IAF_CODE, NACE, NACE_CHILD, dan nace_child_detail yang mengandung kata kunci dari data scope berikut
3. Cari kecocokan di SEMUA level: standar, IAF_CODE, NACE description, nace_child_title, title, dan terutama nace_child_detail_description
4. KEMBALIKAN SEMUA HASIL yang ditemukan, jangan dibatasi hanya top results
5. Urutkan berdasarkan relevansi tertinggi
6. Format response dalam JSON dengan struktur:
{
    "hasil_pencarian": [
        {
            "scope_key": "scope_9001_2015",
            "iaf_code": "Pertanian, Kehutanan, dan Perikanan (01)",
            "nace_code": "01",
            "nace_child_code": "01.1",
            "nace_child_detail_code": "01.11",
            "relevance_score": 95
        },
        ... (kembalikan SEMUA hasil yang match, bisa ratusan)
    ],
    "penjelasan": "penjelasan singkat kenapa hasil ini cocok",
    "saran": "saran tambahan jika ada"
}

Data Scope yang tersedia:
${scopeContext}

Pencarian user: "${correctedQuery}"

ATURAN PENTING:
- Cari di semua level termasuk nace_child_detail_description yang sangat detail
- KEMBALIKAN SEMUA hasil yang mengandung kata kunci, JANGAN batasi jumlahnya
- Jika kata kunci ditemukan di IAF_CODE, NACE description, atau detail description, HARUS dikembalikan
- Berikan relevance_score (0-100) untuk setiap hasil
- hasil_pencarian harus array of objects dengan struktur di atas (bisa ratusan items)
- Urutkan dari relevance_score tertinggi
- Berikan response dalam format JSON yang valid
- JANGAN skip hasil yang relevan, kembalikan SEMUA yang ditemukan
`;

    const config = {
      responseModalities: [
        'TEXT',
      ],
      maxOutputTokens: 8192, // Increase output token limit untuk hasil lebih banyak
    };

    const model = 'gemini-2.0-flash';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config,
      contents,
    });

    // Extract the text response from Gemini
    const aiResponseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      return NextResponse.json(
        { error: 'Invalid response from AI' },
        { status: 500 }
      );
    }

    try {
      // Clean the AI response text (remove markdown code blocks if present)
      let cleanedText = aiResponseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      // Parse the AI response as JSON
      const aiResult = JSON.parse(cleanedText);

      // Validate the response structure
      if (!aiResult.hasil_pencarian || !Array.isArray(aiResult.hasil_pencarian)) {
        throw new Error('Invalid AI response structure');
      }

      console.log(`📊 AI returned ${aiResult.hasil_pencarian.length} results`);

      // Group results by scope_key + iaf_code + nace_code + nace_child_code
      const groupedResults: Record<string, any> = {};

      for (const result of aiResult.hasil_pencarian) {
        const scopeKey = result.scope_key;
        const scopeInfo = scopeData[scopeKey as keyof typeof scopeData];

        if (!scopeInfo) continue;

        for (const iafScope of scopeInfo.scope) {
          if (result.iaf_code && !iafScope.IAF_CODE.includes(result.iaf_code.split('(')[0].trim())) continue;

          if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

          for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
            if (!naceDetail || typeof naceDetail !== 'object' || !('NACE' in naceDetail)) continue;
            if (result.nace_code && naceDetail.NACE.code !== result.nace_code) continue;

            if (!Array.isArray(naceDetail.NACE_CHILD)) continue;

            for (const naceChild of naceDetail.NACE_CHILD) {
              if (result.nace_child_code && naceChild.code !== result.nace_child_code) continue;

              // Aman: handle dua kemungkinan properti
              const childDetails =
                "nace_child_detail" in naceChild
                  ? naceChild.nace_child_detail
                  : "NACE_CHILD_DETAIL" in naceChild
                  ? naceChild.NACE_CHILD_DETAIL
                  : undefined;

              if (!Array.isArray(childDetails)) continue;

              // Create unique key for grouping
              const groupKey = `${scopeKey}|${iafScope.IAF_CODE}|${naceDetail.NACE.code}|${naceChild.code}`;

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
                  relevance_score: result.relevance_score || 0,
                };
              }

              // Sort jika perlu
              const sortedDetails = [...childDetails];
              if (result.nace_child_detail_code) {
                sortedDetails.sort((a, b) => {
                  if (a.code === result.nace_child_detail_code) return -1;
                  if (b.code === result.nace_child_detail_code) return 1;
                  return 0;
                });
              }

              // Tambahkan child detail unik
              for (const childDetail of sortedDetails) {
                const alreadyExists = groupedResults[groupKey].nace_child_details.some(
                  (d: any) => d.code === childDetail.code
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

          }
        }
      }

      const detailedResults = Object.values(groupedResults).filter(r => r.nace_child_details.length > 0);

      console.log(`📦 Grouped into ${detailedResults.length} result cards`);
      console.log(`📝 Total detail codes across all cards: ${detailedResults.reduce((sum, r) => sum + r.nace_child_details.length, 0)}`);

      // Build penjelasan with typo correction info for AI fallback
      let aiPenjelasan = '';
      if (hasCorrected) {
        aiPenjelasan = `Kami mendeteksi kemungkinan typo pada pencarian Anda. Pencarian "${query}" telah dikoreksi menjadi "${correctedQuery}".\n\n`;
      }
      aiPenjelasan += aiResult.penjelasan;

      return NextResponse.json({
        hasil_pencarian: detailedResults,
        penjelasan: aiPenjelasan,
        saran: aiResult.saran,
        total_hasil: detailedResults.length,
        query: query,
        corrected_query: hasCorrected ? correctedQuery : undefined
      });

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('AI Response Text:', aiResponseText);

      // Fallback: return raw AI response
      return NextResponse.json({
        hasil_pencarian: [],
        penjelasan: "Terjadi kesalahan dalam memproses respons AI",
        saran: "Silakan coba dengan kata kunci yang lebih spesifik",
        raw_ai_response: aiResponseText,
        query: query
      });
    }

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}