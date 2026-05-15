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

function buildFastScopeResults(aiText: string, query: string, isIDN: boolean, explicitCodes?: Set<number>): FastScopeResult | null {
  const ref = scopeTSI.scope_reference as Record<string, unknown>;
  const results: FastGroupedResult[] = [];

  // Use only explicit IAFCODES tag values when provided (avoids picking up codes from tables/lists in AI text)
  const iafCodes: Set<number> = explicitCodes ?? (() => {
    const s = new Set<number>();
    for (const m of aiText.matchAll(/IAF\s*(\d+)/gi)) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n)) s.add(n);
    }
    return s;
  })();

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

function hasQuestionBlock(text: string): boolean {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (let i = 0; i < lines.length - 1; i++) {
    if (/^1\.\s+.+/.test(lines[i]) && /^2\.\s+.+/.test(lines[i + 1])) return true;
  }
  return false;
}

// Detect if user message describes a business specifically enough to trigger intake.
// General questions ("apa itu ISO?", "saya punya usaha") go to AI first for conversational response.
function isScopeQuery(text: string): boolean {
  // Exclude general/info questions that don't describe a business
  const isGeneralQuestion = /^\s*(apa|what|how|bagaimana|kenapa|why|siapa|who|kapan|when|berapa|mana|where)\b/i.test(text);
  if (isGeneralQuestion) return false;

  const hasBusinessActivity = /\b(pabrik|perusahaan|industri|industry|produk|layanan|service|jasa|nace|iaf|ea[\s-]?code|haccp|ispo|iscc|tentukan|determine|ruang.?lingkup|bergerak|bidang|manufaktur|produksi|pengolahan|pertanian|konstruksi|perdagangan|distribusi|repair|perbaikan|servis)\b/i.test(text);
  const hasScopeRequest = /\b(scope|sertifikasi|certif|iso\s*\d)\b/i.test(text) && !/^\s*(apa|what|apakah|is\s+it|does)\b/i.test(text);
  // "usaha" or "bisnis" only qualifies with enough context (5+ words)
  const hasGenericWithContext = /\b(usaha|bisnis)\b/i.test(text) && text.trim().split(/\s+/).length >= 5;

  return hasBusinessActivity || hasScopeRequest || hasGenericWithContext;
}

// Check if intake/clarifying questions have already been shown in this conversation.
// Detects any previous assistant message that contained numbered-option question blocks.
function intakeAlreadyShown(messages: ChatMessage[]): boolean {
  return messages.some(m => m.role === 'assistant' && hasQuestionBlock(m.content));
}

async function generateIntakeQuestions(userQuery: string, isIDN: boolean): Promise<string> {
  const intakePrompt = isIDN
    ? `Kamu adalah asisten untuk menentukan scope sertifikasi ISO.

Pengguna baru saja mendeskripsikan bisnis mereka:
"${userQuery}"

Tugasmu: buat formulir intake singkat (2-4 pertanyaan saja) untuk mengumpulkan informasi yang BELUM disebutkan user. Skip pertanyaan yang sudah terjawab dalam deskripsi di atas.

Pertanyaan standar yang perlu dicakup (hanya tanyakan jika BELUM disebutkan user):
- Standar sertifikasi yang diinginkan — gunakan pilihan ini persis:
  1. ISO 9001 (Mutu)
  2. ISO 14001 (Lingkungan)
  3. ISO 45001 (K3)
  4. Integrasi ISO 9001 + ISO 14001 + ISO 45001
  5. Lainnya
- Apakah ada aktivitas lain di luar yang sudah disebutkan
- Jumlah lokasi (satu lokasi / multi-site)
- Apakah ada aktivitas yang dikecualikan dari scope

Format WAJIB untuk setiap pertanyaan — satu pertanyaan per blok, dipisahkan baris kosong:
[Teks pertanyaan]
1. [Pilihan A]
2. [Pilihan B]
3. [Pilihan C jika perlu]
4. Lainnya (jika perlu)

Tulis intro 1 kalimat sebelum pertanyaan pertama. Jangan tambahkan penjelasan lain.`
    : `You are an assistant for ISO certification scope determination.

The user just described their business:
"${userQuery}"

Your task: create a short intake form (2-4 questions only) to collect information NOT yet mentioned by the user. Skip questions already answered in the description above.

Standard questions to cover (only ask if NOT already provided):
- Desired certification standard — use exactly these options:
  1. ISO 9001 (Quality)
  2. ISO 14001 (Environment)
  3. ISO 45001 (OHS)
  4. Integrated ISO 9001 + ISO 14001 + ISO 45001
  5. Other
- Whether there are additional activities beyond what was mentioned
- Number of locations (single site / multi-site)
- Whether any activities are excluded from scope

REQUIRED format for each question — one question per block, separated by blank lines:
[Question text]
1. [Option A]
2. [Option B]
3. [Option C if needed]
4. Other (if needed)

Write a 1-sentence intro before the first question. No other explanations.`;

  try {
    const text = await callAI(intakePrompt, [], 600);
    // Strip any leaked tags just in case
    const clean = text
      .replace(/IAFCODES:[^\n\r]*/gi, '')
      .replace(/KEYWORDS:[^\n\r]*/gi, '')
      .replace(/SUMMARY:[^\n\r]*/gi, '')
      .replace(/LANG:[^\n\r]*/gi, '')
      .trim();
    return clean;
  } catch {
    // Fallback to static template if AI call fails
    if (isIDN) {
      return [
        'Untuk menentukan scope yang tepat, mohon jawab beberapa pertanyaan berikut:',
        'Standar sertifikasi apa yang Anda inginkan?',
        '1. ISO 9001 (Mutu)',
        '2. ISO 14001 (Lingkungan)',
        '3. ISO 45001 (K3)',
        '4. Integrasi ISO 9001 + ISO 14001 + ISO 45001',
        '',
        'Apakah ada aktivitas lain yang perlu dicakup dalam scope?',
        '1. Tidak ada, hanya yang sudah disebutkan',
        '2. Ya, ada aktivitas tambahan (tulis di kolom lainnya)',
        '',
        'Sertifikasi ini untuk berapa lokasi?',
        '1. Satu lokasi saja',
        '2. Multi-site (lebih dari satu lokasi)',
        '',
        'Apakah ada aktivitas yang akan dikecualikan dari scope?',
        '1. Tidak ada exclusion',
        '2. Ya, ada yang dikecualikan (tulis di kolom lainnya)',
      ].join('\n');
    } else {
      return [
        'To determine the right scope, please answer a few questions:',
        'What certification standard do you want?',
        '1. ISO 9001 (Quality)',
        '2. ISO 14001 (Environment)',
        '3. ISO 45001 (OHS)',
        '4. Integrated ISO 9001 + ISO 14001 + ISO 45001',
        '',
        'Are there any other activities to include in scope?',
        '1. No, only what was mentioned',
        '2. Yes, additional activities (write in the other field)',
        '',
        'How many locations for this certification?',
        '1. Single site only',
        '2. Multi-site (more than one location)',
        '',
        'Are there any activities to be excluded from scope?',
        '1. No exclusions',
        '2. Yes, there are exclusions (write in the other field)',
      ].join('\n');
    }
  }
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

    // Server-side enforcement: show intake form before any scope search
    // This is 100% reliable — does not depend on AI following prompt instructions
    const lastUserMsg = messages[messages.length - 1]?.content ?? '';
    const isIDN = /\b(saya|apa|ini|itu|dan|yang|untuk|dengan|di|ke|dari|ada|tidak|bisa|mau|ingin|tolong|mohon|punya|usaha|bisnis|perusahaan|pabrik|servis|jasa|layanan|tentukan|bidang|bergerak)\b/i.test(lastUserMsg);
    if (isScopeQuery(lastUserMsg) && !intakeAlreadyShown(messages)) {
      const intakeText = await generateIntakeQuestions(lastUserMsg, isIDN);
      return NextResponse.json({ phase: 'asking', chat_message: intakeText });
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

**The intake form is always shown by the system before you are called.** By the time the user's answers reach you, they have confirmed:
1. Which certification standard(s) they want
2. Whether there are additional activities beyond what they described
3. How many locations
4. Whether there are any exclusions

**Your job after receiving intake answers:**
- Read all the user's answers and the original business description from the conversation history
- Map the business activity to the most specific IAF code(s) — choose 1-3, not a broad list
- NEVER say "PT TSI does not have that scope" — you are not the final judge
- NACE codes are broad: repair/maintenance of metal products → NACE 33.1 (IAF 17); general services → NACE 69-82 (IAF 35); manufacturing → NACE 10-33 (IAF 14/23)
- Output your explanation then KEYWORDS/SUMMARY immediately

**If user asks a general or follow-up question:**
- Answer naturally; only output KEYWORDS/SUMMARY if they want a new scope search

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
→ In your explanation text, write the 1-3 MOST RELEVANT IAF code numbers explicitly using the format "IAF X". Do NOT list all possible codes — choose only the primary/best match(es).
→ After your explanation, ALWAYS append these tags at the very end of your message:
IAFCODES:<only the 1-3 most relevant IAF numbers, e.g. 17 or 17,23>
KEYWORDS:<keyword1>,<keyword2>,<keyword3>
SUMMARY:<1-2 sentence description of the user's business activity in detail>
LANG:IDN

IMPORTANT: The IAFCODES tag is the ONLY source used for scope lookup. A broad list of codes will return irrelevant results. Be precise — pick the best fitting IAF code(s) for the specific business.
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

    // If AI included a confirmation/clarifying question (numbered list), skip scope search
    // regardless of whether KEYWORDS/SUMMARY tags are also present.
    if ((keywordsMatch || summaryMatch) && !hasQuestionBlock(aiText)) {
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

      // Extract explicit IAFCODES tag — use only these, not all IAF mentions in free text
      const iafcodesMatch = aiText.match(/IAFCODES:([^\n\r]+)/i);
      const explicitCodes = iafcodesMatch
        ? new Set(iafcodesMatch[1].split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n)))
        : undefined;

      // Fast path: use explicit codes from IAFCODES tag (avoids picking up codes from tables/explanations)
      let fastResults = buildFastScopeResults(aiText, searchQuery, isIDN, explicitCodes);

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

    // Strip any leaked backend tags before sending to client
    const cleanText = aiText
      .replace(/IAFCODES:[^\n\r]*/gi, '')
      .replace(/KEYWORDS:[^\n\r]*/gi, '')
      .replace(/SUMMARY:[^\n\r]*/gi, '')
      .replace(/LANG:[^\n\r]*/gi, '')
      .trim();
    return NextResponse.json({ phase: 'asking', chat_message: cleanText });
  } catch (error) {
    console.error('Scope Chat API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
