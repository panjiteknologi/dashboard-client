const fs = require('fs');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');
require('dotenv').config();

// Batch size untuk translate
const BATCH_SIZE = 5; // Process 5 items at a time
const DELAY_MS = 1000; // Delay between batches to avoid rate limits

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi untuk translate text menggunakan Gemini
async function translateWithGemini(texts, ai) {
  const prompt = `Translate the following English texts to Indonesian (Bahasa Indonesia). Keep technical terms and codes unchanged. Return ONLY a JSON array of translations in the same order.

Input texts:
${JSON.stringify(texts, null, 2)}

Rules:
- Translate to natural Indonesian
- Keep codes, numbers, and technical abbreviations unchanged
- Preserve the structure and meaning
- Return ONLY valid JSON array, no markdown or explanations

Example:
Input: ["Crop and animal production", "Support activities"]
Output: ["Produksi tanaman dan hewan", "Kegiatan pendukung"]`;

  try {
    const model = 'gemini-2.0-flash';
    const contents = [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ];

    const response = await ai.models.generateContent({
      model,
      config: { responseModalities: ['TEXT'] },
      contents,
    });

    const aiResponseText = response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponseText) {
      throw new Error('No response from Gemini');
    }

    // Clean response
    let cleanedText = aiResponseText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const translations = JSON.parse(cleanedText);

    if (!Array.isArray(translations) || translations.length !== texts.length) {
      console.warn('Translation count mismatch, using original texts');
      return texts;
    }

    return translations;
  } catch (error) {
    console.error('Translation error:', error.message);
    return texts; // Return original if translation fails
  }
}

// Fungsi untuk collect semua text yang perlu ditranslate dari scope data
function collectTextsToTranslate(scopeData) {
  const textsMap = new Map(); // Use Map to avoid duplicates
  let id = 0;

  function addText(text) {
    if (text && typeof text === 'string' && text.trim() && !textsMap.has(text)) {
      textsMap.set(text, id++);
    }
  }

  for (const scopeValue of Object.values(scopeData)) {
    if (!scopeValue.scope || !Array.isArray(scopeValue.scope)) continue;

    for (const iafScope of scopeValue.scope) {
      if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

      for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
        if (naceDetail?.NACE?.nace_description) {
          addText(naceDetail.NACE.nace_description);
        }

        if (Array.isArray(naceDetail.NACE_CHILD)) {
          for (const naceChild of naceDetail.NACE_CHILD) {
            if (naceChild.nace_child_title) {
              addText(naceChild.nace_child_title);
            }

            if (Array.isArray(naceChild.nace_child_detail)) {
              for (const detail of naceChild.nace_child_detail) {
                if (detail.title) {
                  addText(detail.title);
                }
                if (detail.nace_child_detail_description) {
                  addText(detail.nace_child_detail_description);
                }
              }
            }
          }
        }
      }
    }
  }

  return Array.from(textsMap.keys());
}

// Fungsi untuk apply translations ke scope data
function applyTranslations(scopeData, translationMap) {
  const translated = JSON.parse(JSON.stringify(scopeData)); // Deep clone

  for (const scopeValue of Object.values(translated)) {
    if (!scopeValue.scope || !Array.isArray(scopeValue.scope)) continue;

    for (const iafScope of scopeValue.scope) {
      if (!Array.isArray(iafScope.NACE_DETAIL_INFORMATION)) continue;

      for (const naceDetail of iafScope.NACE_DETAIL_INFORMATION) {
        if (naceDetail?.NACE?.nace_description) {
          const original = naceDetail.NACE.nace_description;
          naceDetail.NACE.nace_description = translationMap.get(original) || original;
        }

        if (Array.isArray(naceDetail.NACE_CHILD)) {
          for (const naceChild of naceDetail.NACE_CHILD) {
            if (naceChild.nace_child_title) {
              const original = naceChild.nace_child_title;
              naceChild.nace_child_title = translationMap.get(original) || original;
            }

            if (Array.isArray(naceChild.nace_child_detail)) {
              for (const detail of naceChild.nace_child_detail) {
                if (detail.title) {
                  const original = detail.title;
                  detail.title = translationMap.get(original) || original;
                }
                if (detail.nace_child_detail_description) {
                  const original = detail.nace_child_detail_description;
                  detail.nace_child_detail_description = translationMap.get(original) || original;
                }
              }
            }
          }
        }
      }
    }
  }

  return translated;
}

async function main() {
  console.log('🚀 Memulai translate scope_en.json menggunakan Gemini AI...');

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY tidak ditemukan di .env');
    process.exit(1);
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const inputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_en.json');
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_id.json');

  console.log('📖 Membaca file scope_en.json...');
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const scopeData = JSON.parse(rawData);

  console.log('🔍 Mengumpulkan semua teks yang perlu ditranslate...');
  const textsToTranslate = collectTextsToTranslate(scopeData);
  console.log(`📝 Total teks yang perlu ditranslate: ${textsToTranslate.length}`);

  console.log('🌐 Memulai proses translate dengan Gemini AI...');
  const translationMap = new Map();

  // Process in batches
  const totalBatches = Math.ceil(textsToTranslate.length / BATCH_SIZE);

  for (let i = 0; i < textsToTranslate.length; i += BATCH_SIZE) {
    const batch = textsToTranslate.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    console.log(`   Batch ${batchNum}/${totalBatches} (${batch.length} items)...`);

    const translations = await translateWithGemini(batch, ai);

    // Store translations
    batch.forEach((text, idx) => {
      translationMap.set(text, translations[idx]);
    });

    // Progress
    const progress = Math.min(100, Math.round((i + batch.length) / textsToTranslate.length * 100));
    console.log(`   Progress: ${progress}% (${i + batch.length}/${textsToTranslate.length})`);

    // Delay to avoid rate limits (except for last batch)
    if (i + BATCH_SIZE < textsToTranslate.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log('🔄 Menerapkan translations ke data...');
  const translatedData = applyTranslations(scopeData, translationMap);

  console.log('💾 Menyimpan file scope_id.json...');
  fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), 'utf8');

  console.log('✅ Translate selesai!');
  console.log('📊 Statistik:');
  console.log(`   - Total scope keys: ${Object.keys(translatedData).length}`);
  console.log(`   - Total teks ditranslate: ${translationMap.size}`);
  console.log(`   - Output file: ${outputPath}`);
}

main().catch(console.error);
