import { WebinarsType } from "@/types/projects";

export const dataWebinars: WebinarsType[] = [
  {
    id: 1,
    title: "Pemahaman ISO 45001: Sistem Manajemen K3",
    subtitle:
      "Pelatihan untuk memahami penerapan ISO 45001 terkait Kesehatan dan Keselamatan Kerja.",
    image: "https://picsum.photos/800/450?random=1",
    students: 98,
    chapters: 4,
    time: "2 jam 15 menit",
    level: "Intermediate",
    price: "Rp 50.000",
    author: "Ir. Dedi Santosa",
    modules: [
      { title: "Pengantar ISO 45001", duration: "20 menit", isFree: true },
      {
        title: "Identifikasi Bahaya & Risiko",
        duration: "30 menit",
        isFree: false,
      },
      {
        title: "Dokumentasi & Implementasi",
        duration: "45 menit",
        isFree: false,
      },
      {
        title: "Audit Internal & Tindakan Korektif",
        duration: "40 menit",
        isFree: false,
      },
    ],
    relatedCourses: [
      {
        title: "ISO 45001 untuk Industri Manufaktur",
        price: "Rp 55.000",
        thumbnail: "https://source.unsplash.com/featured/?factory,safety",
      },
    ],
  },
  {
    id: 2,
    title: "ISO 27001: Sistem Manajemen Keamanan Informasi",
    subtitle:
      "Pelajari prinsip dan penerapan standar keamanan informasi global.",
    image: "https://picsum.photos/800/450?random=1",
    students: 145,
    chapters: 5,
    time: "3 jam",
    level: "Beginner",
    price: "Rp 60.000",
    author: "Ahmad Ramli",
    modules: [
      { title: "Pendahuluan ISO 27001", duration: "25 menit", isFree: true },
      { title: "Analisa Risiko Keamanan", duration: "40 menit", isFree: false },
      {
        title: "Kontrol & Kebijakan ISMS",
        duration: "35 menit",
        isFree: false,
      },
      {
        title: "Implementasi & Pemantauan",
        duration: "45 menit",
        isFree: false,
      },
      { title: "Sertifikasi & Audit", duration: "35 menit", isFree: false },
    ],
    relatedCourses: [
      {
        title: "ISO 27001 untuk Startup Digital",
        price: "Rp 65.000",
        thumbnail: "https://source.unsplash.com/featured/?startup,technology",
      },
    ],
  },
  {
    id: 3,
    title: "ISO 14001: Sistem Manajemen Lingkungan",
    subtitle:
      "Pelatihan komprehensif untuk menerapkan ISO 14001 di tempat kerja.",
    image: "https://picsum.photos/800/450?random=1",
    students: 76,
    chapters: 3,
    time: "2 jam",
    level: "Intermediate",
    price: "Rp 55.000",
    author: "Dr. Rina Maulida",
    modules: [
      { title: "Pengenalan ISO 14001", duration: "20 menit", isFree: true },
      {
        title: "Aspek & Dampak Lingkungan",
        duration: "40 menit",
        isFree: false,
      },
      {
        title: "Penerapan & Audit Internal",
        duration: "60 menit",
        isFree: false,
      },
    ],
    relatedCourses: [
      {
        title: "ISO 14001 untuk Sektor Publik",
        price: "Rp 50.000",
        thumbnail: "https://picsum.photos/800/450?random=1",
      },
    ],
  },
];
