import { VideoTypes } from "@/types/options";

export interface VideoCategory {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
    videos: VideoTypes[];
  }[];
}

export const dummyVideoData: VideoCategory[] = [
  {
    id: "webinar",
    name: "Webinar",
    subCategories: [
      {
        id: "webinar-sustainability",
        name: "Sustainability",
        videos: [
          {
            id: 1,
            title: "Webinar dasar dasar k3 u sawit",
            description: "Webinar dasar dasar k3 u sawit",
            url: "https://www.youtube.com/embed/XnKXs1CfrEA",
          },
        ],
      },
      {
        id: "webinar-manajemen-sistem",
        name: "Manajemen Sistem",
        videos: [
          {
            id: 2,
            title: "Tsi talk 3",
            description: "Perubahan 37k versi 2016 dan 2025",
            url: "https://www.youtube.com/embed/67RfluXSUxY",
          },
        ],
      },
      {
        id: "webinar-ict",
        name: "ICT",
        videos: [],
      },
      {
        id: "webinar-food",
        name: "Food",
        videos: [],
      },
    ],
  },
  {
    id: "animasi",
    name: "Animasi",
    subCategories: [
      {
        id: "animasi-sustainability",
        name: "Sustainability",
        videos: [
          {
            id: 3,
            title: "Cara Memilih TBS",
            description: "Edukasi Animasi TSI",
            url: "https://www.youtube.com/embed/C2GMvj_LH9I",
          },
        ],
      },
      {
        id: "animasi-hse",
        name: "HSE",
        videos: [
          {
            id: 4,
            title: "Job Safety Analysis",
            description: "Animasi Edukasi TSI ",
            url: "https://www.youtube.com/embed/n73Kz44Wmdw",
          },
          {
            id: 5,
            title: "Lock Out Take Out",
            description: "Animasi Edukasi TSI",
            url: "https://www.youtube.com/embed/8DjD26UKgXg",
          },
          {
            id: 6,
            title: "Permit To Work",
            description: "Animasi HSE Seri ke #8 ",
            url: "https://www.youtube.com/embed/H3mohLD0sRw?si=fo3MduKYX067sh7L",
          },
          {
            id: 7,
            title: "Safety Driving ala Smith System",
            description: "Animasi HSE Seri ke #9",
            url: "https://www.youtube.com/embed/FWrgwj9fcwk?si=8GxhVQcXo6agX14Z",
          },
          {
            id: 8,
            title: "Safety Driving Kendaraan Bermotor Roda 2",
            description: "Animasi HSE Seri ke #14 ",
            url: "https://www.youtube.com/embed/AOr41Lb3QcQ?si=z47-SIG88PCm3a9B",
          },
          {
            id: 9,
            title: "Prinsip Ergonomi K3 Perkantoran",
            description: "Animasi HSE Seri ke #15 ",
            url: "https://www.youtube.com/embed/3EhB7fD6fKo?si=cv5BUPvYnPF4TAXy",
          },
        ],
      },
      {
        id: "animasi-keamanan-informasi",
        name: "Keamanan Informasi",
        videos: [
          {
            id: 10,
            title: "Kesadaran Keamanan Informasi Bagi Seluruh Karyawan",
            description: "Animasi Keamanan Informasi #2",
            url: "https://www.youtube.com/embed/XCBez2t-jFg?si=7EzZZmDVT7S9qaIA",
          },
          {
            id: 11,
            title: "Hak Akses Istimewa",
            description: "Animasi Keamanan Informasi #3",
            url: "https://www.youtube.com/embed/umFmZpt6_DM?si=p6nTyJ-ywXObrYFc",
          },
          {
            id: 12,
            title: "Manajemen Kerentanan Teknis",
            description: "Animasi Keamanan Informasi #4",
            url: "https://www.youtube.com/embed/TevqOnw0qa0?si=LmziujYSZ__-zRMx",
          },
          {
            id: 13,
            title: "Penerapan ISO 27001 Sebagai Sistem Pengelolaan Keamanan Informasi",
            description: "Animasi Keamanan Informasi #1",
            url: "https://www.youtube.com/embed/4l7xxWfQSJo?si=FT5t-hB-K01g_N0v",
          },
          {
            id: 14,
            title: "Membatasi akses pengguna ke situs web",
            description: "Animasi Keamanan Informasi #7",
            url: "https://www.youtube.com/embed/qoEksnwFPGQ?si=APRs-mjRxbncqT1G",
          },
          {
            id: 15,
            title: "Pengujian keamanan dalam pengembangan dan penerimaan",
            description: "Animasi Keamanan Informasi #8",
            url: "https://www.youtube.com/embed/HZQ6PDA9C_c?si=fN3IQzCjDKr2ZHvm",
          },
          {
            id: 16,
            title: "Remote working",
            description: "Animasi Keamanan Informasi #11",
            url: "https://www.youtube.com/embed/5QtgMrkET3Q?si=wrQm1RWcJd4TXUn4",
          },
          {
            id: 17,
            title: "Security of network services",
            description: "Animasi Keamanan Informasi #12",
            url: "https://www.youtube.com/embed/4dEhx6MJ2rI?si=vp2B585EfALW7hUQ",
          }
        ],
      },
    ],
  },
];
