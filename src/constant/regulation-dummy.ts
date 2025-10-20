import { RegulationType } from "@/types/projects";
// import {
//   scope9001,
//   scope14001,
//   scope21001,
//   scope22000,
//   scope27001,
//   scope45001,
//   scopeHACCP,
//   scopeISCCEU,
//   scopeISCCPlus,
//   scopeISPO,
//   scope20000,
//   scope37001,
//   scope37301,
// } from "./scope";
import { detailedRegulationData } from "./detailed-regulation-data";

export interface RegulationCategory {
  id: string;
  name: string;
  subCategories: {
    id: string;
    name: string;
    regulations: RegulationType[];
  }[];
}

// const createStandardRegulation = (
//   id: number,
//   standardName: string,
//   subtitle: string,
//   scopes: string[],
//   type: "Lingkup" | "Deskripsi" = "Lingkup"
// ): RegulationType => {
//   const summary = type === "Deskripsi"
//     ? scopes[0]
//     : `Standar ${standardName} mencakup ruang lingkup sebagai berikut:\n\n${scopes.map(s => `- ${s}`).join("\n")}}`;

//   return {
//     id,
//     title: `${standardName}`,
//     subtitle,
//     image: "",
//     number: standardName,
//     type: "Standar Internasional",
//     issuer: "Lembaga Sertifikasi",
//     sector: standardName,
//     jurisdiction: "Internasional",
//     status: "Berlaku",
//     publishedAt: "-",
//     effectiveAt: "-",
//     summary,
//     keywords: [standardName, type],
//     sourceUrl: "#",
//   };
// };

const perundanganK3Category: RegulationCategory = {
    id: "perundangan-k3",
    name: "Perundangan K3",
    subCategories: detailedRegulationData.reduce((acc, regulation) => {
        let subCategory = acc.find(sc => sc.name === regulation.sector);
        if (!subCategory) {
            subCategory = {
                id: regulation.sector.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name: regulation.sector,
                regulations: [],
            };
            acc.push(subCategory);
        }
        subCategory.regulations.push(regulation);
        return acc;
    }, [] as RegulationCategory["subCategories"])
};

export const dummyRegulationData: RegulationCategory[] = [
  perundanganK3Category
  // {
  //   id: "standar-iso",
  //   name: "Standar ISO",
  //   subCategories: [
  //     {
  //       id: "iso-9001",
  //       name: "ISO 9001",
  //       regulations: [createStandardRegulation(9001, "ISO 9001", "Sistem Manajemen Mutu", scope9001)],
  //     },
  //     {
  //       id: "iso-14001",
  //       name: "ISO 14001",
  //       regulations: [createStandardRegulation(14001, "ISO 14001", "Sistem Manajemen Lingkungan", scope14001)],
  //     },
  //     {
  //       id: "iso-45001",
  //       name: "ISO 45001",
  //       regulations: [createStandardRegulation(45001, "ISO 45001", "Sistem Manajemen K3", scope45001)],
  //     },
  //     {
  //       id: "iso-22000",
  //       name: "ISO 22000",
  //       regulations: [createStandardRegulation(22000, "ISO 22000", "Sistem Manajemen Keamanan Pangan", scope22000)],
  //     },
  //     {
  //       id: "iso-27001",
  //       name: "ISO 27001",
  //       regulations: [createStandardRegulation(27001, "ISO 27001", "Sistem Manajemen Keamanan Informasi", scope27001, "Deskripsi")],
  //     },
  //     {
  //       id: "iso-20000",
  //       name: "ISO 20000",
  //       regulations: [createStandardRegulation(20000, "ISO 20000", "Manajemen Layanan TI", scope20000, "Deskripsi")],
  //     },
  //     {
  //       id: "iso-21001",
  //       name: "ISO 21001",
  //       regulations: [createStandardRegulation(21001, "ISO 21001", "Sistem Manajemen Organisasi Pendidikan", scope21001)],
  //     },
  //     {
  //       id: "iso-37001",
  //       name: "ISO 37001",
  //       regulations: [createStandardRegulation(37001, "ISO 37001", "Sistem Manajemen Anti-Suap", scope37001, "Deskripsi")],
  //     },
  //     {
  //       id: "iso-37301",
  //       name: "ISO 37301",
  //       regulations: [createStandardRegulation(37301, "ISO 37301", "Sistem Manajemen Kepatuhan", scope37301, "Deskripsi")],
  //     },
  //   ],
  // },
  // {
  //   id: "standar-keamanan-pangan",
  //   name: "Standar Keamanan Pangan",
  //   subCategories: [
  //     {
  //       id: "haccp",
  //       name: "HACCP",
  //       regulations: [createStandardRegulation(8080, "HACCP", "Hazard Analysis and Critical Control Points", scopeHACCP)],
  //     },
  //   ],
  // },
  // {
  //   id: "standar-sustainability",
  //   name: "Standar Sustainability",
  //   subCategories: [
  //     {
  //       id: "ispo",
  //       name: "ISPO",
  //       regulations: [createStandardRegulation(9901, "ISPO", "Indonesian Sustainable Palm Oil", scopeISPO)],
  //     },
  //     {
  //       id: "iscc-eu",
  //       name: "ISCC EU",
  //       regulations: [createStandardRegulation(9902, "ISCC EU", "International Sustainability and Carbon Certification EU", scopeISCCEU, "Deskripsi")],
  //     },
  //     {
  //       id: "iscc-plus",
  //       name: "ISCC Plus",
  //       regulations: [createStandardRegulation(9903, "ISCC Plus", "International Sustainability and Carbon Certification Plus", scopeISCCPlus, "Deskripsi")],
  //     },
  //   ],
  // },
];