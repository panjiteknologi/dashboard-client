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

  const [primary, ...rest] = scopeData.hasil_pencarian;
  const alternatives = rest.slice(0, 2);
  const lines: string[] = [];

  lines.push(isIDN ? '✅ **Rekomendasi Scope Sertifikasi:**\n' : '✅ **Recommended Certification Scope:**\n');
  lines.push(`**${primary.standar || primary.scope_key}**`);
  lines.push(`📋 IAF Code: ${primary.iaf_code}`);
  lines.push(`🔢 NACE ${primary.nace.code}: ${primary.nace.description}`);
  lines.push(`🔸 NACE Child ${primary.nace_child.code}: ${primary.nace_child.title}`);

  if (primary.nace_child_details?.length) {
    lines.push(isIDN ? '\nAktivitas yang tercakup:' : '\nCovered activities:');
    primary.nace_child_details.slice(0, 3).forEach((d) => {
      lines.push(`• **${d.code}** — ${d.title}`);
    });
  }

  if (alternatives.length > 0) {
    lines.push('');
    lines.push(isIDN ? '---\n💡 **Alternatif yang relevan:**' : '---\n💡 **Relevant alternatives:**');
    alternatives.forEach((r) => {
      lines.push(`• **${r.standar || r.scope_key}** — NACE ${r.nace.code}, IAF ${r.iaf_code}`);
    });
  }

  lines.push('');
  lines.push('---');
  lines.push(
    isIDN
      ? `📌 _Data dari database ruang lingkup sertifikasi PT TSI, mengacu pada standar **IAF** dan klasifikasi **NACE**. Penetapan final memerlukan verifikasi auditor._`
      : `📌 _Data from PT TSI's certification scope database, referencing **IAF** and **NACE** standards. Final determination requires auditor verification._`
  );

  return lines.join('\n');
}
