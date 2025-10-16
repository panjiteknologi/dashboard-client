import { RegulationType } from "@/types/projects";
import {
  scope9001,
  scope14001,
  scope21001,
  scope22000,
  scope27001,
  scope45001,
  scopeHACCP,
  scopeISCCEU,
  scopeISCCPlus,
  scopeISPO,
  scope20000,
  scope37001,
  scope37301,
} from "./scope";

// Kumpulan data regulasi K3 yang lebih lengkap dengan sourceUrl
const k3Regulations: { [key: string]: RegulationType } = {
  uu_1_1970: {
    id: 101,
    title: "UU No. 1 Tahun 1970 tentang Keselamatan Kerja",
    subtitle: "Landasan hukum utama untuk seluruh upaya keselamatan kerja di Indonesia.",
    image: "",
    number: "UU No. 1/1970",
    type: "Undang-Undang",
    issuer: "Pemerintah Indonesia",
    sector: "K3 Umum",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "1970-01-23",
    effectiveAt: "1970-01-23",
    summary: "Mengatur prinsip dasar, syarat-syarat keselamatan kerja, pengawasan, serta hak dan kewajiban tenaga kerja dan pengurus perusahaan.",
    keywords: ["Dasar Hukum K3", "Pengawasan"],
    sourceUrl: "https://peraturan.bpk.go.id/Details/118031/uu-no-1-tahun-1970",
  },
  pp_50_2012: {
    id: 102,
    title: "PP No. 50 Tahun 2012 tentang Penerapan SMK3",
    subtitle: "Mewajibkan penerapan Sistem Manajemen Keselamatan dan Kesehatan Kerja.",
    image: "",
    number: "PP No. 50/2012",
    type: "Peraturan Pemerintah",
    issuer: "Pemerintah Indonesia",
    sector: "Manajemen K3",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "2012-04-12",
    effectiveAt: "2012-04-12",
    summary: "Memberikan panduan bagi setiap perusahaan untuk menerapkan dan melakukan audit Sistem Manajemen K3 (SMK3) untuk menekan angka kecelakaan kerja.",
    keywords: ["SMK3", "Audit K3", "Manajemen Risiko"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-pemerintah-nomor-50-tahun-2012",
  },
  permenaker_4_1987: {
    id: 103,
    title: "Permenaker No. 4 Tahun 1987 tentang P2K3",
    subtitle: "Mengatur tentang Panitia Pembina Keselamatan dan Kesehatan Kerja (P2K3).",
    image: "",
    number: "PER.04/MEN/1987",
    type: "Peraturan Menteri",
    issuer: "Kementerian Tenaga Kerja",
    sector: "K3 Umum",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "1987-06-29",
    effectiveAt: "1987-06-29",
    summary: "Mengatur tata cara pembentukan, susunan, dan tugas dari P2K3 sebagai wadah kerjasama antara pengurus dan tenaga kerja di perusahaan.",
    keywords: ["P2K3", "Organisasi K3"],
    sourceUrl: "https://jdih.kemnaker.go.id/search?q=PER.04/MEN/1987",
  },
  permenaker_8_2010: {
    id: 104,
    title: "Permenaker No. 8 Tahun 2010 tentang Alat Pelindung Diri",
    subtitle: "Kewajiban penyediaan dan penggunaan Alat Pelindung Diri (APD) di tempat kerja.",
    image: "",
    number: "PER.08/MEN/VII/2010",
    type: "Peraturan Menteri",
    issuer: "Kementerian Tenaga Kerja",
    sector: "APD",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "2010-07-01",
    effectiveAt: "2010-07-01",
    summary: "Mewajibkan pengusaha untuk menyediakan APD yang sesuai bagi pekerja dan mewajibkan pekerja untuk menggunakannya demi mencegah cedera.",
    keywords: ["APD", "Alat Pelindung Diri"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-menteri-tenaga-kerja-dan-transmigrasi-nomor-per-08-men-vii-2010-tahun-2010",
  },
  permenaker_5_2018: {
    id: 105,
    title: "Permenaker No. 5 Tahun 2018 tentang K3 Lingkungan Kerja",
    subtitle: "Pengukuran dan pengendalian faktor bahaya di lingkungan kerja.",
    image: "",
    number: "PER.5/MEN/2018",
    type: "Peraturan Menteri",
    issuer: "Kementerian Ketenagakerjaan",
    sector: "Lingkungan Kerja",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "2018-04-27",
    effectiveAt: "2018-04-27",
    summary: "Mengatur nilai ambang batas (NAB) untuk faktor fisika, kimia, biologi, ergonomi, dan psikologi di lingkungan kerja.",
    keywords: ["Lingkungan Kerja", "NAB", "Faktor Bahaya"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-menteri-ketenagakerjaan-nomor-5-tahun-2018",
  },
  permenaker_15_2008: {
    id: 106,
    title: "Permenaker No. 15 Tahun 2008 tentang P3K di Tempat Kerja",
    subtitle: "Mengatur Pertolongan Pertama Pada Kecelakaan (P3K) di tempat kerja.",
    image: "",
    number: "PER.15/MEN/VIII/2008",
    type: "Peraturan Menteri",
    issuer: "Kementerian Tenaga Kerja",
    sector: "Kesehatan Kerja",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "2008-08-30",
    effectiveAt: "2008-08-30",
    summary: "Mewajibkan pengusaha untuk menyediakan petugas P3K dan fasilitas P3K yang memadai di tempat kerja.",
    keywords: ["P3K", "Kecelakaan Kerja"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-menteri-tenaga-kerja-dan-transmigrasi-nomor-per-15-men-viii-2008-tahun-2008",
  },
  permenaker_4_1980: {
    id: 107,
    title: "Permenaker No. 4 Tahun 1980 tentang Syarat Pemasangan APAR",
    subtitle: "Regulasi tentang Alat Pemadam Api Ringan (APAR).",
    image: "",
    number: "PER.04/MEN/1980",
    type: "Peraturan Menteri",
    issuer: "Kementerian Tenaga Kerja",
    sector: "Penanggulangan Kebakaran",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "1980-01-14",
    effectiveAt: "1980-01-14",
    summary: "Mengatur syarat-syarat pemasangan dan pemeliharaan APAR untuk kesiapsiagaan dalam menghadapi kebakaran.",
    keywords: ["APAR", "Kebakaran"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-menteri-tenaga-kerja-dan-transmigrasi-nomor-per-04-men-1980-tahun-1980",
  },
  permenaker_12_2015: {
    id: 108,
    title: "Permenaker No. 12 Tahun 2015 tentang K3 Listrik di Tempat Kerja",
    subtitle: "Regulasi keselamatan dan kesehatan kerja terkait instalasi listrik.",
    image: "",
    number: "PER.12/MEN/2015",
    type: "Peraturan Menteri",
    issuer: "Kementerian Ketenagakerjaan",
    sector: "K3 Listrik",
    jurisdiction: "Nasional",
    status: "Berlaku",
    publishedAt: "2015-08-24",
    effectiveAt: "2015-08-24",
    summary: "Memberikan pedoman dan syarat K3 untuk perencanaan, pemasangan, penggunaan, pemeliharaan, dan pemeriksaan instalasi listrik.",
    keywords: ["Listrik", "Instalasi"],
    sourceUrl: "https://jdih.kemnaker.go.id/katalog-hukum/peraturan-menteri-ketenagakerjaan-nomor-12-tahun-2015",
  },
};

export interface RegulationCategory {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
    regulations: RegulationType[];
  }[];
}

const createStandardRegulation = (
  id: number,
  standardName: string,
  subtitle: string,
  scopes: string[],
  type: "Lingkup" | "Deskripsi" = "Lingkup"
): RegulationType => {
  const summary = type === "Deskripsi"
    ? scopes[0]
    : `Standar ${standardName} mencakup ruang lingkup sebagai berikut:\n\n${scopes.map(s => `- ${s}`).join("\n")}}`;

  return {
    id,
    title: `${standardName}`,
    subtitle,
    image: "",
    number: standardName,
    type: "Standar Internasional",
    issuer: "Lembaga Sertifikasi",
    sector: standardName,
    jurisdiction: "Internasional",
    status: "Berlaku",
    publishedAt: "-",
    effectiveAt: "-",
    summary,
    keywords: [standardName, type],
    sourceUrl: "#",
  };
};

export const dummyRegulationData: RegulationCategory[] = [
  {
    id: "ak3-umum",
    name: "Ahli K3 Umum",
    subCategories: [
      {
        id: "dasar-kelembagaan",
        name: "Dasar & Kelembagaan K3",
        regulations: [k3Regulations.uu_1_1970, k3Regulations.pp_50_2012, k3Regulations.permenaker_4_1987],
      },
      {
        id: "kesehatan-lingkungan-kerja",
        name: "Kesehatan & Lingkungan Kerja",
        regulations: [k3Regulations.permenaker_5_2018, k3Regulations.permenaker_15_2008],
      },
      {
        id: "penanggulangan-kebakaran",
        name: "Penanggulangan Kebakaran",
        regulations: [k3Regulations.permenaker_4_1980],
      },
      {
        id: "listrik-mekanik",
        name: "K3 Listrik & Mekanik",
        regulations: [k3Regulations.permenaker_12_2015],
      },
      {
        id: "apd",
        name: "Alat Pelindung Diri",
        regulations: [k3Regulations.permenaker_8_2010],
      },
    ],
  },
  {
    id: "standar-iso",
    name: "Standar ISO",
    subCategories: [
      {
        id: "iso-9001",
        name: "ISO 9001",
        regulations: [createStandardRegulation(9001, "ISO 9001", "Sistem Manajemen Mutu", scope9001)],
      },
      {
        id: "iso-14001",
        name: "ISO 14001",
        regulations: [createStandardRegulation(14001, "ISO 14001", "Sistem Manajemen Lingkungan", scope14001)],
      },
      {
        id: "iso-45001",
        name: "ISO 45001",
        regulations: [createStandardRegulation(45001, "ISO 45001", "Sistem Manajemen K3", scope45001)],
      },
      {
        id: "iso-22000",
        name: "ISO 22000",
        regulations: [createStandardRegulation(22000, "ISO 22000", "Sistem Manajemen Keamanan Pangan", scope22000)],
      },
      {
        id: "iso-27001",
        name: "ISO 27001",
        regulations: [createStandardRegulation(27001, "ISO 27001", "Sistem Manajemen Keamanan Informasi", scope27001, "Deskripsi")],
      },
      {
        id: "iso-20000",
        name: "ISO 20000",
        regulations: [createStandardRegulation(20000, "ISO 20000", "Manajemen Layanan TI", scope20000, "Deskripsi")],
      },
      {
        id: "iso-21001",
        name: "ISO 21001",
        regulations: [createStandardRegulation(21001, "ISO 21001", "Sistem Manajemen Organisasi Pendidikan", scope21001)],
      },
      {
        id: "iso-37001",
        name: "ISO 37001",
        regulations: [createStandardRegulation(37001, "ISO 37001", "Sistem Manajemen Anti-Suap", scope37001, "Deskripsi")],
      },
      {
        id: "iso-37301",
        name: "ISO 37301",
        regulations: [createStandardRegulation(37301, "ISO 37301", "Sistem Manajemen Kepatuhan", scope37301, "Deskripsi")],
      },
    ],
  },
  {
    id: "standar-keamanan-pangan",
    name: "Standar Keamanan Pangan",
    subCategories: [
      {
        id: "haccp",
        name: "HACCP",
        regulations: [createStandardRegulation(8080, "HACCP", "Hazard Analysis and Critical Control Points", scopeHACCP)],
      },
    ],
  },
  {
    id: "standar-sustainability",
    name: "Standar Sustainability",
    subCategories: [
      {
        id: "ispo",
        name: "ISPO",
        regulations: [createStandardRegulation(9901, "ISPO", "Indonesian Sustainable Palm Oil", scopeISPO)],
      },
      {
        id: "iscc-eu",
        name: "ISCC EU",
        regulations: [createStandardRegulation(9902, "ISCC EU", "International Sustainability and Carbon Certification EU", scopeISCCEU, "Deskripsi")],
      },
      {
        id: "iscc-plus",
        name: "ISCC Plus",
        regulations: [createStandardRegulation(9903, "ISCC Plus", "International Sustainability and Carbon Certification Plus", scopeISCCPlus, "Deskripsi")],
      },
    ],
  },
];
