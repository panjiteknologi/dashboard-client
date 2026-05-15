import { NextRequest, NextResponse } from 'next/server';

async function callAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const apiUrl = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1/chat/completions';
  const primaryModel = process.env.OPENROUTER_MODEL || 'nvidia/llama-3.3-nemotron-super-49b-v1:free';
  const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL || 'openai/gpt-oss-120b:free';

  if (!apiKey) throw new Error('OPENROUTER_API_KEY missing');

  const doRequest = (model: string) =>
    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'https://tsicertification.co.id',
        'X-Title': 'TSI Scope Sentence',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0,
        max_tokens: 500,
        response_format: { type: 'json_object' },
      }),
    });

  let res = await doRequest(primaryModel);
  if (res.status === 402) {
    console.warn('[scope-sentence] Credit limit hit, using fallback:', fallbackModel);
    res = await doRequest(fallbackModel);
  }
  if (!res.ok) throw new Error(`OpenRouter API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string)?.trim() || '';
}

function buildDocument(params: {
  company_name: string;
  standard: string;
  iaf_code: string;
  nace_division: string;
  nace_class: string;
  nace_description: string;
  kbli_code: string;
  kbli_description: string;
  scope_en: string;
  scope_id: string;
}): string {
  const pad = (label: string) => label.padEnd(12);
  return [
    'RUANG LINGKUP SERTIFIKASI',
    '='.repeat(45),
    `${pad('Perusahaan')}: ${params.company_name}`,
    `${pad('Standar')}: ${params.standard}`,
    `${pad('IAF Code')}: ${params.iaf_code}`,
    `${pad('NACE Rev.2')}: Division ${params.nace_division}, Class ${params.nace_class}`,
    `${' '.repeat(14)}(${params.nace_description})`,
    `${pad('KBLI')}: ${params.kbli_code} — ${params.kbli_description}`,
    '',
    'KALIMAT SCOPE (Bahasa Inggris):',
    params.scope_en,
    '',
    'KALIMAT SCOPE (Bahasa Indonesia):',
    params.scope_id,
  ].join('\n');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      company_name,
      standard,
      iaf_code,
      nace_code,
      nace_description,
      nace_child_details,
      business_description,
    } = body;

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY missing' }, { status: 500 });
    }

    const companyDisplay = (company_name || '').trim() || 'Perusahaan Anda';
    const subActivities = (nace_child_details as Array<{ code: string; title: string }> || [])
      .slice(0, 5)
      .map(d => `${d.code}: ${d.title}`)
      .join('; ');

    const prompt = `You are an expert in ISO certification and Indonesian business classification (KBLI).

Scope determination result:
- Standard: ${standard}
- IAF Code: ${iaf_code}
- NACE Rev.2 code: ${nace_code}
- NACE description: ${nace_description}
- Sub-activities: ${subActivities || nace_description}
- Business description: ${business_description || nace_description}

Tasks:
1. Find the most accurate 5-digit KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) code and its official Indonesian description for this activity.
2. Write a concise formal certification scope sentence in English (1-2 lines, start with a verb: "Manufacture of...", "Provision of...", "Design and development of...", etc.) as it would appear on an ISO certificate.
3. Write the same formal scope sentence in Indonesian (1-2 lines).
4. Identify the NACE division number (e.g., "22") and the most specific NACE class (e.g., "22.11").

Return valid JSON only:
{
  "kbli_code": "22111",
  "kbli_description": "Industri ban luar dan ban dalam kendaraan bermotor roda empat atau lebih",
  "scope_en": "Manufacture of rubber tyres and tubes for passenger cars and light vehicles",
  "scope_id": "Manufaktur ban karet dan tabung untuk kendaraan penumpang dan kendaraan ringan",
  "nace_division": "22",
  "nace_class": "22.11"
}`;

    const rawText = await callAI(prompt);

    let aiResult: {
      kbli_code: string;
      kbli_description: string;
      scope_en: string;
      scope_id: string;
      nace_division: string;
      nace_class: string;
    };

    try {
      const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
      aiResult = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response', raw: rawText }, { status: 500 });
    }

    // Derive nace_division and nace_class from nace_code if AI didn't provide them
    const naceParts = nace_code?.split('.') ?? [];
    const nace_division = aiResult.nace_division || naceParts[0] || nace_code;
    const nace_class = aiResult.nace_class || nace_code;

    const document = buildDocument({
      company_name: companyDisplay,
      standard,
      iaf_code,
      nace_division,
      nace_class,
      nace_description,
      kbli_code: aiResult.kbli_code,
      kbli_description: aiResult.kbli_description,
      scope_en: aiResult.scope_en,
      scope_id: aiResult.scope_id,
    });

    return NextResponse.json({
      document,
      kbli_code: aiResult.kbli_code,
      kbli_description: aiResult.kbli_description,
      scope_en: aiResult.scope_en,
      scope_id: aiResult.scope_id,
    });
  } catch (error) {
    console.error('[scope-sentence] Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
