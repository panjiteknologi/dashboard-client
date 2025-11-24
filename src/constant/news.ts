import { NewsType } from "@/types/news";

export const dataNews: NewsType[] = [
  {
    id: 1,
    title: "PT TSI Raih Akreditasi KAN untuk Lembaga Sertifikasi Sistem Manajemen",
    subtitle: "Pencapaian baru dalam komitmen memberikan layanan sertifikasi berkualitas tinggi",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop",
    number: "NEWS-001",
    type: "Berita",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Sertifikasi & Akreditasi",
    jurisdiction: "Indonesia",
    status: "Berlaku",
    publishedAt: "2025-01-15",
    effectiveAt: "2025-01-15",
    summary:
      "PT TSI Sertifikasi Internasional dengan bangga mengumumkan telah meraih akreditasi dari Komite Akreditasi Nasional (KAN) sebagai Lembaga Sertifikasi Sistem Manajemen. Pencapaian ini menandai komitmen kami dalam memberikan layanan sertifikasi ISO yang berkualitas dan terpercaya kepada pelanggan di seluruh Indonesia.",
    keywords: [
      "Akreditasi KAN",
      "Sertifikasi ISO",
      "Sistem Manajemen",
      "PT TSI",
    ],
    sourceUrl: "https://www.tsi-certification.com/news",
    attachments: [
      {
        filename: "Sertifikat-Akreditasi-KAN.pdf",
        url: "/files/news/sertifikat-kan-2025.pdf",
      },
    ],
    sections: [
      {
        title: "Tentang Akreditasi",
        description: "Akreditasi KAN merupakan pengakuan formal atas kompetensi PT TSI dalam melakukan sertifikasi sistem manajemen sesuai standar internasional.",
      },
      {
        title: "Manfaat untuk Klien",
        description: "Sertifikat yang dikeluarkan PT TSI kini diakui secara internasional melalui skema IAF MLA (International Accreditation Forum Multilateral Recognition Arrangement).",
      },
      {
        title: "Komitmen Berkelanjutan",
        description: "PT TSI akan terus meningkatkan kualitas layanan dan memperluas cakupan skema sertifikasi untuk memenuhi kebutuhan industri.",
      },
    ],
    relatedRegulations: [
      { id: 2, title: "Peluncuran Platform Digital TSI E-Learning" },
    ],
    modules: [],
    relatedCourses: ["Persiapan Audit ISO 9001", "Sistem Manajemen Mutu"],
    author: "Tim Redaksi PT TSI",
    time: "5 menit baca",
    students: "2.5k",
    chapters: "3 Bagian",
    level: "All Levels",
    price: "Gratis",
  },
  {
    id: 2,
    title: "Peluncuran Platform Digital TSI E-Learning untuk Member Premium",
    subtitle: "Akses pembelajaran ISO dan sertifikasi secara online kapan saja, dimana saja",
    image:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=450&fit=crop",
    number: "NEWS-002",
    type: "Berita",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Teknologi & Edukasi",
    jurisdiction: "Indonesia",
    status: "Berlaku",
    publishedAt: "2025-01-10",
    effectiveAt: "2025-01-10",
    summary:
      "PT TSI meluncurkan platform e-learning terbaru yang memberikan akses penuh kepada member premium untuk mempelajari standar ISO, persiapan audit, dan best practices dalam sistem manajemen. Platform ini dilengkapi dengan 100+ kursus interaktif, video tutorial, dan sertifikat digital.",
    keywords: [
      "E-Learning",
      "Platform Digital",
      "Member Premium",
      "Training ISO",
    ],
    sourceUrl: "https://www.tsi-certification.com/elearning",
    attachments: [
      {
        filename: "Panduan-E-Learning-Platform.pdf",
        url: "/files/news/panduan-elearning.pdf",
      },
    ],
    sections: [
      {
        title: "Fitur Platform",
        description: "Lebih dari 100 kursus, video tutorial HD, quiz interaktif, dan progress tracking untuk memantau pembelajaran Anda.",
      },
      {
        title: "Benefit Member Premium",
        description: "Akses unlimited ke semua kursus, webinar eksklusif bulanan, konsultasi dengan ahli, dan sertifikat digital yang diakui industri.",
      },
      {
        title: "Cara Mengakses",
        description: "Login ke dashboard Anda, navigasi ke menu E-Learning, dan mulai perjalanan pembelajaran ISO Anda hari ini.",
      },
    ],
    relatedRegulations: [
      { id: 1, title: "PT TSI Raih Akreditasi KAN" },
      { id: 3, title: "Webinar Gratis: Implementasi ISO 9001:2015" },
    ],
    modules: [
      { duration: "8 menit", title: "Pengenalan Platform E-Learning", isFree: true },
      { duration: "12 menit", title: "Navigasi dan Fitur Utama", isFree: true },
    ],
    relatedCourses: ["ISO 9001 Foundation", "Internal Auditor Training"],
    author: "Tim Digital PT TSI",
    time: "4 menit baca",
    students: "3.1k",
    chapters: "3 Bagian",
    level: "All Levels",
    price: "Premium",
  },
  {
    id: 3,
    title: "Webinar Gratis: Implementasi ISO 9001:2015 untuk UMKM",
    subtitle: "Pelajari cara mengimplementasikan sistem manajemen mutu di bisnis Anda",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    number: "NEWS-003",
    type: "Event",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Edukasi & Workshop",
    jurisdiction: "Indonesia",
    status: "Berlaku",
    publishedAt: "2025-01-08",
    effectiveAt: "2025-01-20",
    summary:
      "Bergabunglah dalam webinar gratis PT TSI yang akan membahas langkah praktis implementasi ISO 9001:2015 khusus untuk UMKM. Webinar ini akan dipandu oleh lead auditor berpengalaman dan mencakup studi kasus nyata dari berbagai industri.",
    keywords: [
      "Webinar",
      "ISO 9001",
      "UMKM",
      "Gratis",
    ],
    sourceUrl: "https://www.tsi-certification.com/webinar",
    attachments: [
      {
        filename: "Materi-Webinar-ISO-9001.pdf",
        url: "/files/webinar/iso-9001-umkm.pdf",
      },
    ],
    sections: [
      {
        title: "Agenda Webinar",
        description: "Pengantar ISO 9001, gap analysis, dokumentasi QMS, implementasi bertahap, dan persiapan sertifikasi.",
      },
      {
        title: "Pembicara",
        description: "Dipandu oleh Ir. Ahmad Fauzi, Lead Auditor ISO 9001 dengan pengalaman 15+ tahun di berbagai industri.",
      },
      {
        title: "Pendaftaran",
        description: "Gratis untuk 100 peserta pertama. Daftar sekarang melalui dashboard Anda atau hubungi customer service kami.",
      },
    ],
    relatedRegulations: [
      { id: 2, title: "Peluncuran Platform Digital TSI E-Learning" },
    ],
    modules: [
      { duration: "90 menit", title: "Webinar ISO 9001 untuk UMKM", isFree: true },
    ],
    relatedCourses: ["ISO 9001 Implementation Guide", "Quality Management System"],
    author: "Tim Event PT TSI",
    time: "3 menit baca",
    students: "850",
    chapters: "3 Bagian",
    level: "Beginner",
    price: "Gratis",
  },
  {
    id: 4,
    title: "PT TSI Sertifikasi 50+ Perusahaan Manufaktur di Tahun 2024",
    subtitle: "Rekor baru jumlah sertifikasi ISO yang diselesaikan dalam satu tahun",
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=450&fit=crop",
    number: "NEWS-004",
    type: "Berita",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Industri & Manufaktur",
    jurisdiction: "Indonesia",
    status: "Berlaku",
    publishedAt: "2025-01-05",
    effectiveAt: "2025-01-05",
    summary:
      "Di tahun 2024, PT TSI berhasil menyelesaikan sertifikasi untuk lebih dari 50 perusahaan manufaktur di berbagai sektor termasuk otomotif, farmasi, elektronik, dan makanan-minuman. Pencapaian ini mencerminkan kepercayaan industri terhadap kredibilitas dan profesionalisme tim auditor PT TSI.",
    keywords: [
      "Sertifikasi",
      "Manufaktur",
      "ISO Certification",
      "Pencapaian 2024",
    ],
    sourceUrl: "https://www.tsi-certification.com/achievements",
    attachments: [
      {
        filename: "Laporan-Tahunan-2024.pdf",
        url: "/files/reports/annual-report-2024.pdf",
      },
    ],
    sections: [
      {
        title: "Statistik Sertifikasi",
        description: "52 perusahaan tersertifikasi: 30 ISO 9001, 15 ISO 14001, 7 ISO 45001, dengan tingkat kepuasan klien 98%.",
      },
      {
        title: "Testimoni Klien",
        description: "Para klien mengapresiasi pendekatan consultative PT TSI yang tidak hanya audit, tetapi juga memberikan insight untuk improvement.",
      },
      {
        title: "Target 2025",
        description: "PT TSI menargetkan 75+ sertifikasi baru dan ekspansi ke sektor jasa dan teknologi informasi.",
      },
    ],
    relatedRegulations: [
      { id: 1, title: "PT TSI Raih Akreditasi KAN" },
    ],
    modules: [],
    relatedCourses: ["Manufacturing Excellence", "ISO for Industry"],
    author: "Tim Redaksi PT TSI",
    time: "6 menit baca",
    students: "1.8k",
    chapters: "3 Bagian",
    level: "All Levels",
    price: "Gratis",
  },
  {
    id: 5,
    title: "Update: Persyaratan Baru ISO 9001:2025 dan Dampaknya",
    subtitle: "Persiapkan organisasi Anda untuk transisi standar ISO terbaru",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    number: "NEWS-005",
    type: "Update",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Standar & Regulasi",
    jurisdiction: "Internasional",
    status: "Berlaku",
    publishedAt: "2025-01-03",
    effectiveAt: "2025-01-03",
    summary:
      "ISO mengumumkan revisi standar ISO 9001 yang akan efektif di 2025. PT TSI mengadakan program khusus untuk membantu klien memahami perubahan dan mempersiapkan transisi dengan lancar. Program ini mencakup gap analysis, workshop, dan pendampingan implementasi.",
    keywords: [
      "ISO 9001:2025",
      "Transisi Standar",
      "Update Regulasi",
      "Gap Analysis",
    ],
    sourceUrl: "https://www.iso.org/iso-9001-revision",
    attachments: [
      {
        filename: "Perubahan-ISO-9001-2025.pdf",
        url: "/files/updates/iso-9001-2025-changes.pdf",
      },
      {
        filename: "Panduan-Transisi.pdf",
        url: "/files/updates/transition-guide.pdf",
      },
    ],
    sections: [
      {
        title: "Perubahan Utama",
        description: "Fokus pada digitalisasi, sustainability, dan risk-based thinking yang lebih komprehensif.",
      },
      {
        title: "Timeline Transisi",
        description: "Periode transisi 3 tahun mulai publikasi standar. Sertifikat lama tetap valid hingga surveillance berikutnya.",
      },
      {
        title: "Program Pendampingan TSI",
        description: "PT TSI menawarkan paket lengkap: gap analysis, training, dokumentasi update, dan mock audit sebelum assessment resmi.",
      },
    ],
    relatedRegulations: [
      { id: 2, title: "Peluncuran Platform Digital TSI E-Learning" },
    ],
    modules: [
      { duration: "15 menit", title: "Pengenalan ISO 9001:2025", isFree: true },
      { duration: "20 menit", title: "Perubahan Klausul Penting", isFree: false },
      { duration: "25 menit", title: "Strategi Transisi Efektif", isFree: false },
    ],
    relatedCourses: ["ISO 9001:2025 Transition", "Advanced QMS"],
    author: "Technical Team PT TSI",
    time: "8 menit baca",
    students: "2.2k",
    chapters: "3 Bagian",
    level: "Intermediate",
    price: "Gratis",
  },
  {
    id: 6,
    title: "Kisah Sukses: Dari Startup hingga Tersertifikasi ISO dalam 6 Bulan",
    subtitle: "Perjalanan PT Maju Bersama meraih sertifikasi ISO 9001 bersama PT TSI",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&h=450&fit=crop",
    number: "NEWS-006",
    type: "Studi Kasus",
    issuer: "PT TSI Sertifikasi Internasional",
    sector: "Success Story",
    jurisdiction: "Indonesia",
    status: "Berlaku",
    publishedAt: "2024-12-28",
    effectiveAt: "2024-12-28",
    summary:
      "PT Maju Bersama, startup teknologi dengan 25 karyawan, berhasil meraih sertifikasi ISO 9001:2015 hanya dalam 6 bulan dengan pendampingan intensif dari PT TSI. Kisah ini membuktikan bahwa perusahaan kecil pun dapat mengimplementasikan sistem manajemen berkualitas tinggi.",
    keywords: [
      "Success Story",
      "Startup",
      "ISO 9001",
      "Studi Kasus",
    ],
    sourceUrl: "https://www.tsi-certification.com/case-study",
    attachments: [
      {
        filename: "Case-Study-PT-Maju-Bersama.pdf",
        url: "/files/case-studies/maju-bersama.pdf",
      },
    ],
    sections: [
      {
        title: "Profil Perusahaan",
        description: "PT Maju Bersama adalah startup SaaS yang ingin meningkatkan kredibilitas di mata investor dan klien enterprise.",
      },
      {
        title: "Proses Implementasi",
        description: "Dimulai dari gap analysis, training karyawan, penyusunan dokumentasi, hingga simulasi audit internal sebelum assessment.",
      },
      {
        title: "Hasil dan Manfaat",
        description: "Setelah tersertifikasi, perusahaan mendapat 3 klien enterprise baru dan meningkatkan efisiensi operasional 30%.",
      },
    ],
    relatedRegulations: [
      { id: 3, title: "Webinar Gratis: Implementasi ISO 9001:2015" },
    ],
    modules: [],
    relatedCourses: ["ISO for Startups", "Quick Implementation Guide"],
    author: "Success Story Team",
    time: "7 menit baca",
    students: "1.5k",
    chapters: "3 Bagian",
    level: "All Levels",
    price: "Gratis",
  },
];
