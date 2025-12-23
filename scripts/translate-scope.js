const fs = require('fs');
const path = require('path');

// Kamus translate manual untuk istilah teknis yang sering muncul
const translationDict = {
  // Instructions - harus di atas
  "This class includes all forms of": "Kelas ini mencakup semua bentuk",
  "This class includes": "Kelas ini mencakup",
  "This class excludes": "Kelas ini tidak termasuk",

  // NACE main categories
  "Crop and animal production, hunting and related service activities": "Produksi tanaman dan hewan, perburuan dan kegiatan layanan terkait",
  "Support activities to agriculture and post-harvest crop activities": "Kegiatan pendukung pertanian dan kegiatan pasca panen tanaman",

  // Titles
  "Growing of cereals (except rice), leguminous crops and oil seeds": "Penanaman serealia (kecuali beras), tanaman kacang-kacangan dan biji minyak",
  "Growing of rice": "Penanaman padi",
  "Growing of vegetables and melons, roots and tubers": "Penanaman sayuran dan melon, akar dan umbi",
  "Growing of sugar cane": "Penanaman tebu",
  "Growing of tobacco": "Penanaman tembakau",
  "Growing of fibre crops": "Penanaman tanaman serat",
  "Growing of other non-perennial crops": "Penanaman tanaman non-tahunan lainnya",
  "Growing of grapes": "Penanaman anggur",
  "Growing of tropical and subtropical fruits": "Penanaman buah tropis dan subtropis",
  "Growing of citrus fruits": "Penanaman buah jeruk",
  "Growing of pome fruits and stone fruits": "Penanaman buah pome dan buah berbiji",
  "Growing of other tree and bush fruits and nuts": "Penanaman buah pohon dan semak serta kacang lainnya",
  "Growing of oleaginous fruits": "Penanaman buah penghasil minyak",
  "Growing of beverage crops": "Penanaman tanaman minuman",
  "Growing of spices, aromatic, drug and pharmaceutical crops": "Penanaman rempah-rempah, aromatik, obat dan tanaman farmasi",
  "Growing of non-perennial crops": "Penanaman tanaman non-tahunan",
  "Growing of perennial crops": "Penanaman tanaman tahunan",

  // Common phrases
  "growing of": "penanaman",
  "production of": "produksi",
  "manufacture of": "pembuatan",
  "in open fields": "di lahan terbuka",
  "is often combined within agricultural units": "sering digabungkan dalam unit pertanian",
  "all other": "semua lainnya",
  "the growing of": "penanaman",
  "such as": "seperti",
  "including": "termasuk",
  "excluding": "tidak termasuk",
  "except": "kecuali",
  "see": "lihat",
  "incl.": "termasuk",
  "n.e.c.": "t.t.l.",
  "other": "lainnya",
  "and": "dan",
  "or": "atau",
  "in": "di",
  "for": "untuk",
  "of": "dari",
  "the": "",

  // Specific crops
  "cereals": "serealia",
  "leguminous crops": "tanaman kacang-kacangan",
  "oil seeds": "biji minyak",
  "wheat": "gandum",
  "grain maize": "jagung",
  "sorghum": "sorgum",
  "barley": "jelai",
  "rye": "gandum hitam",
  "oats": "oat",
  "millets": "jewawut",
  "rice": "padi",
  "vegetables": "sayuran",
  "melons": "melon",
  "roots": "akar",
  "tubers": "umbi",
  "leafy or stem vegetables": "sayuran berdaun atau batang",
  "fruit bearing vegetables": "sayuran berbuah",
  "root, bulb or tuberous vegetables": "sayuran akar, umbi lapis atau umbi",
  "sugar beet": "bit gula",
  "sugar cane": "tebu",
  "tobacco": "tembakau",
  "tobacco products": "produk tembakau",
  "fibre crops": "tanaman serat",
  "cotton": "kapas",
  "jute": "goni",
  "kenaf": "kenaf",
  "textile bast fibres": "serat kulit kayu tekstil",
  "flax": "rami",
  "true hemp": "rami sejati",
  "sisal": "sisal",
  "textile fibre": "serat tekstil",
  "vegetable textile fibres": "serat tekstil nabati",
  "non-perennial crops": "tanaman non-tahunan",
  "swedes": "lobak swedia",
  "mangolds": "bit pakan",
  "fodder roots": "akar pakan ternak",
  "clover": "semanggi",
  "alfalfa": "alfalfa",
  "sainfoin": "sainfoin",
  "fodder maize": "jagung pakan ternak",
  "grasses": "rumput",
  "forage kale": "kale pakan ternak",
  "forage products": "produk pakan ternak",
  "forage plants": "tanaman pakan ternak",
  "flowers": "bunga",
  "cut flowers": "bunga potong",
  "flower buds": "kuncup bunga",
  "flower seeds": "biji bunga",
  "vegetable seeds": "biji sayuran",
  "beans": "kacang",
  "broad beans": "kacang fava",
  "chick peas": "kacang arab",
  "cow peas": "kacang tunggak",
  "lentils": "lentil",
  "lupines": "lupin",
  "peas": "kacang polong",
  "pigeon peas": "kacang gude",
  "soya beans": "kedelai",
  "groundnuts": "kacang tanah",
  "castor bean": "jarak",
  "linseed": "biji rami",
  "mustard seed": "biji sesawi",
  "niger seed": "biji niger",
  "rapeseed": "biji lobak",
  "safflower seed": "biji safflower",
  "sesame seed": "biji wijen",
  "sunflower seed": "biji bunga matahari",
  "sweet corn": "jagung manis",
  "artichokes": "artichoke",
  "asparagus": "asparagus",
  "cabbages": "kubis",
  "cauliflower": "kembang kol",
  "broccoli": "brokoli",
  "lettuce": "selada",
  "chicory": "sawi putih",
  "spinach": "bayam",
  "cucumbers": "timun",
  "gherkins": "acar timun",
  "eggplants": "terong",
  "aubergines": "terong",
  "tomatoes": "tomat",
  "watermelons": "semangka",
  "cantaloupes": "melon",
  "carrots": "wortel",
  "turnips": "lobak",
  "garlic": "bawang putih",
  "onions": "bawang bombai",
  "shallots": "bawang merah",
  "leeks": "daun bawang",
  "alliaceous vegetables": "sayuran allium",
  "mushrooms": "jamur",
  "truffles": "truffle",
  "mushroom spawn": "bibit jamur",
  "potatoes": "kentang",
  "sweet potatoes": "ubi jalar",
  "cassava": "singkong",
  "yams": "ubi",
  "chillies": "cabai",
  "peppers": "lada",
  "capsicum": "paprika",
  "aromatic crops": "tanaman aromatik",
  "spices": "rempah-rempah",

  // Fruits
  "fruits": "buah-buahan",
  "grapes": "anggur",
  "wine grapes": "anggur anggur",
  "table grapes": "anggur meja",
  "vineyards": "kebun anggur",
  "wine": "anggur",
  "tropical and subtropical fruits": "buah tropis dan subtropis",
  "avocados": "alpukat",
  "bananas": "pisang",
  "plantains": "pisang raja",
  "dates": "kurma",
  "figs": "ara",
  "mangoes": "mangga",
  "papayas": "pepaya",
  "pineapples": "nanas",
  "citrus fruits": "buah jeruk",
  "grapefruit": "jeruk bali",
  "pomelo": "jeruk besar",
  "lemons": "lemon",
  "limes": "jeruk nipis",
  "oranges": "jeruk",
  "tangerines": "jeruk mandarin",
  "mandarins": "jeruk mandarin",
  "clementines": "jeruk clementine",
  "pome fruits": "buah pome",
  "stone fruits": "buah berbiji",
  "apples": "apel",
  "apricots": "aprikot",
  "cherries": "ceri",
  "sour cherries": "ceri asam",
  "peaches": "persik",
  "nectarines": "nektarin",
  "pears": "pir",
  "quinces": "quince",
  "plums": "plum",
  "sloes": "sloe",
  "tree and bush fruits": "buah pohon dan semak",
  "nuts": "kacang",
  "berries": "buah beri",
  "blueberries": "bluberi",
  "currants": "kismis",
  "gooseberries": "gooseberry",
  "kiwi fruit": "buah kiwi",
  "raspberries": "raspberry",
  "strawberries": "stroberi",
  "fruit seeds": "biji buah",
  "edible nuts": "kacang yang dapat dimakan",
  "almonds": "almond",
  "cashew nuts": "mete",
  "chestnuts": "kastanye",
  "hazelnuts": "hazelnut",
  "pistachios": "pistachio",
  "walnuts": "kenari",
  "coconuts": "kelapa",
  "locust beans": "biji locust",
  "oleaginous fruits": "buah penghasil minyak",
  "olives": "zaitun",
  "oil palms": "kelapa sawit",

  // Beverages
  "beverage crops": "tanaman minuman",
  "coffee": "kopi",
  "tea": "teh",
  "maté": "mate",
  "cocoa": "kakao",

  // Spices
  "pepper": "lada",
  "piper": "piper",
  "nutmeg": "pala",
  "mace": "bunga pala",
  "cardamoms": "kapulaga",
  "anise": "adas manis",
  "badian": "pekak",
  "fennel": "adas",
  "cinnamon": "kayu manis",
  "canella": "kayu manis",
  "cloves": "cengkeh",
  "ginger": "jahe",
  "vanilla": "vanili",
  "hops": "hop",
  "drug and narcotic crops": "tanaman obat dan narkotika",
  "pharmaceutical crops": "tanaman farmasi",
  "perennial and non-perennial spices": "rempah-rempah tahunan dan non-tahunan",
};

// Fungsi untuk translate text menggunakan kamus
function translateText(text) {
  if (!text || typeof text !== 'string') return text;

  let translated = text;

  // Cek apakah ada terjemahan langsung
  if (translationDict[text]) {
    return translationDict[text];
  }

  // Translate per kata/frase
  Object.entries(translationDict).forEach(([en, id]) => {
    const regex = new RegExp(`\\b${en}\\b`, 'gi');
    translated = translated.replace(regex, id);
  });

  return translated;
}

// Fungsi untuk translate object scope secara rekursif
function translateScope(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => translateScope(item));
  }

  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    // Translate fields yang perlu ditranslate
    if (key === 'nace_description' || key === 'nace_child_title' ||
        key === 'title' || key === 'nace_child_detail_description') {
      translated[key] = translateText(value);
    } else if (typeof value === 'object') {
      translated[key] = translateScope(value);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

// Main function
async function main() {
  // console.log('🚀 Memulai translate scope_en.json...');

  const inputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_en.json');
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'scope_id.json');

  // console.log('📖 Membaca file scope_en.json...');
  const rawData = fs.readFileSync(inputPath, 'utf8');
  const scopeData = JSON.parse(rawData);

  // console.log('🔄 Mentranslate data...');
  const translatedData = translateScope(scopeData);

  // console.log('💾 Menyimpan file scope_id.json...');
  fs.writeFileSync(outputPath, JSON.stringify(translatedData, null, 2), 'utf8');

  // console.log('✅ Translate selesai! File disimpan di:', outputPath);
  // console.log('📊 Total scope keys:', Object.keys(translatedData).length);
}

main().catch(console.error);
