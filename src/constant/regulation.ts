import { RegulationType } from "@/types/projects";

export const dataRegulations: RegulationType[] = [
  {
    id: 1,
    title: "ISO 9001:2015 – Sistem Manajemen Mutu",
    subtitle: "Standar internasional untuk sistem manajemen mutu (QMS).",
    image:
      "https://cdn1-production-images-kly.akamaized.net/3_er-u5OYxxyxS9lwGVtoBJzzwo=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3169251/original/070592500_1593756387-harald-arlander-NuhkHAAF6Y0-unsplash.jpg",
    number: "ISO 9001:2015",
    type: "Standar",
    issuer: "International Organization for Standardization (ISO)",
    sector: "Manajemen Mutu",
    jurisdiction: "Internasional",
    status: "Berlaku",
    publishedAt: "2015-09-23",
    effectiveAt: "2015-09-23",
    summary:
      "Menetapkan persyaratan untuk sistem manajemen mutu, berfokus pada konsistensi produk/jasa, kepuasan pelanggan, dan perbaikan berkelanjutan.",
    keywords: [
      "QMS",
      "audit internal",
      "kontrol dokumen",
      "perbaikan berkelanjutan",
    ],
    sourceUrl: "https://www.iso.org/standard/62085.html",
    attachments: [
      {
        filename: "Ringkasan-ISO-9001-ID.pdf",
        url: "/files/regulations/iso-9001-2015/ringkasan-id.pdf",
      },
    ],
    sections: [
      {
        title: "Ruang Lingkup",
        description: "Tujuan, batasan, dan penerapan standar.",
      },
      {
        title: "Istilah & Definisi",
        description: "Terminologi kunci dalam QMS.",
      },
      {
        title: "Klausul 4–10",
        description:
          "Konteks organisasi, kepemimpinan, perencanaan, dukungan, operasi, evaluasi kinerja, dan peningkatan.",
      },
    ],
    relatedRegulations: [{ id: 2, title: "ISO 31000:2018 – Manajemen Risiko" }],
  },
  {
    id: 2,
    title: "ISO 31000:2018 – Manajemen Risiko",
    subtitle:
      "Pedoman kerangka kerja dan proses manajemen risiko untuk semua jenis organisasi.",
    image:
      "https://cdn1-production-images-kly.akamaized.net/3_er-u5OYxxyxS9lwGVtoBJzzwo=/800x450/smart/filters:quality(75):strip_icc():format(webp)/kly-media-production/medias/3169251/original/070592500_1593756387-harald-arlander-NuhkHAAF6Y0-unsplash.jpg",
    number: "ISO 31000:2018",
    type: "Standar",
    issuer: "International Organization for Standardization (ISO)",
    sector: "Manajemen Risiko",
    jurisdiction: "Internasional",
    status: "Berlaku",
    publishedAt: "2018-02-15",
    effectiveAt: "2018-02-15",
    summary:
      "Memberikan prinsip, kerangka, dan proses manajemen risiko untuk meningkatkan pencapaian tujuan, mengidentifikasi peluang/ancaman, serta meningkatkan tata kelola.",
    keywords: [
      "risk management",
      "kerangka kerja risiko",
      "evaluasi risiko",
      "mitigasi",
    ],
    sourceUrl: "https://www.iso.org/standard/65694.html",
    attachments: [
      {
        filename: "Ringkasan-ISO-31000-ID.pdf",
        url: "/files/regulations/iso-31000-2018/ringkasan-id.pdf",
      },
    ],
    sections: [
      {
        title: "Prinsip",
        description: "Nilai yang mendasari manajemen risiko yang efektif.",
      },
      {
        title: "Kerangka",
        description: "Integrasi ke dalam tata kelola & budaya organisasi.",
      },
      {
        title: "Proses",
        description:
          "Identifikasi, analisis, evaluasi, perlakuan, dan pemantauan risiko.",
      },
    ],
    relatedRegulations: [
      { id: 1, title: "ISO 9001:2015 – Sistem Manajemen Mutu" },
    ],
  },
];
