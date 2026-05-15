import scopeTSI from '@/lib/scope_tsi.json';

export const TSI_STANDARDS = Object.keys(scopeTSI.scope_reference);

export type ScopeData = {
  hasil_pencarian: Array<{
    scope_key: string;
    standar?: string;
    iaf_code: string;
    nace: { code: string; description: string };
    nace_child: { code: string; title: string };
    nace_child_details: Array<{ code: string; title: string; description: string }>;
    relevance_score: number;
    scope_sentence_en?: string;
    scope_sentence_id?: string;
  }>;
  query: string;
  penjelasan?: string;
  saran?: string;
};

export function formatScopeMessage(scopeData: ScopeData | null, isIDN: boolean): string {
  if (!scopeData || !scopeData.hasil_pencarian?.length) {
    const standardList = TSI_STANDARDS.map((s) => `• **${s}**`).join('\n');
    const aiExplanation = scopeData?.penjelasan
      ? `\n\n${scopeData.penjelasan.split('\n')[0]}`
      : '';

    if (isIDN) {
      return [
        `⚠️ **Scope Belum Tersedia di PT TSI**`,
        ``,
        `Berdasarkan informasi yang Anda berikan, saat ini **PT TSI belum memiliki akreditasi** untuk ruang lingkup sertifikasi tersebut.${aiExplanation}`,
        ``,
        `---`,
        `📋 **Standar yang tersedia di PT TSI saat ini:**`,
        standardList,
        ``,
        `---`,
        `💡 **Langkah yang dapat Anda lakukan:**`,
        `1. Periksa apakah aktivitas bisnis Anda masuk dalam salah satu standar di atas`,
        `2. Coba deskripsikan ulang dengan kata kunci yang berbeda`,
        `3. Hubungi tim PT TSI secara langsung untuk konsultasi lebih lanjut`,
        ``,
        `📌 _Ruang lingkup akreditasi PT TSI dapat berkembang seiring waktu. Untuk informasi terkini, silakan konfirmasi langsung ke PT TSI._`,
      ].join('\n');
    } else {
      return [
        `⚠️ **Scope Not Yet Available at PT TSI**`,
        ``,
        `Based on the information you provided, **PT TSI does not currently hold accreditation** for that certification scope.${aiExplanation}`,
        ``,
        `---`,
        `📋 **Standards currently available at PT TSI:**`,
        standardList,
        ``,
        `---`,
        `💡 **Suggested next steps:**`,
        `1. Check if your business activities fall under one of the standards listed above`,
        `2. Try rephrasing your description with different keywords`,
        `3. Contact PT TSI directly for a consultation`,
        ``,
        `📌 _PT TSI's accreditation scope may expand over time. Please confirm directly with PT TSI for the latest information._`,
      ].join('\n');
    }
  }

  const lines: string[] = [];
  lines.push(isIDN ? '✅ **Rekomendasi Scope Sertifikasi Yang Tersedia di PT TSI SERTIFIKASI INTERNASIONAL :**\n' : '✅ **Recommended Scope of Certification Available at PT TSI SERTIFIKASI INTERNASIONAL :**\n');

  // Group by IAF code: each IAF entry may apply to multiple standards (ISO 9001, 14001, 45001)
  type Group = {
    iaf_code: string;
    nace: { code: string; description: string };
    nace_child: { code: string; title: string };
    nace_child_details: Array<{ code: string; title: string; description: string }>;
    standards: string[];
    relevance_score: number;
    scope_sentence_en?: string;
    scope_sentence_id?: string;
  };
  const groupMap = new Map<string, Group>();

  for (const r of scopeData.hasil_pencarian) {
    const key = r.iaf_code;
    if (!groupMap.has(key)) {
      groupMap.set(key, {
        iaf_code: r.iaf_code,
        nace: r.nace,
        nace_child: r.nace_child,
        nace_child_details: r.nace_child_details ?? [],
        standards: [],
        relevance_score: r.relevance_score,
        scope_sentence_en: r.scope_sentence_en,
        scope_sentence_id: r.scope_sentence_id,
      });
    }
    const g = groupMap.get(key)!;
    const stdName = r.standar || r.scope_key;
    if (!g.standards.includes(stdName)) g.standards.push(stdName);
    if (r.relevance_score > g.relevance_score) g.relevance_score = r.relevance_score;
    if (!g.scope_sentence_en && r.scope_sentence_en) g.scope_sentence_en = r.scope_sentence_en;
    if (!g.scope_sentence_id && r.scope_sentence_id) g.scope_sentence_id = r.scope_sentence_id;
  }

  const groups = Array.from(groupMap.values()).sort((a, b) => b.relevance_score - a.relevance_score);

  groups.forEach((g, idx) => {
    if (idx > 0) lines.push('');
    lines.push(`**${idx + 1}. ${g.standards.join(' · ')}**`);
    lines.push(`📋 IAF: ${g.iaf_code}`);
    lines.push(`🔢 NACE ${g.nace.code}: ${g.nace.description}`);
    if (g.nace_child.title && g.nace_child.title !== g.nace.description) {
      lines.push(`🔸 ${g.nace_child.title}`);
    }
    if (g.nace_child_details?.length) {
      lines.push(isIDN ? '\nAktivitas yang tercakup:' : '\nCovered activities:');
      g.nace_child_details.slice(0, 3).forEach((d) => {
        lines.push(`• **${d.code}** — ${d.title}`);
      });
    }
    if (g.scope_sentence_en || g.scope_sentence_id) {
      lines.push('');
      if (g.scope_sentence_en) {
        lines.push(`📝 **KALIMAT SCOPE (Bahasa Inggris):**`);
        lines.push(`_${g.scope_sentence_en}_`);
      }
      if (g.scope_sentence_id) {
        lines.push('');
        lines.push(`📝 **KALIMAT SCOPE (Bahasa Indonesia):**`);
        lines.push(`_${g.scope_sentence_id}_`);
      }
    }
  });

  lines.push('');
  lines.push('---');
  lines.push(
    isIDN
      ? `📌 _Data dari database ruang lingkup sertifikasi PT TSI, mengacu pada standar **IAF** dan klasifikasi **NACE**. Penetapan final memerlukan verifikasi auditor._`
      : `📌 _Data from PT TSI's certification scope database, referencing **IAF** and **NACE** standards. Final determination requires auditor verification._`
  );

  return lines.join('\n');
}
