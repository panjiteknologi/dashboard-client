export interface NewsType {
  students: string;
  chapters: string;
  level: string;
  price: string;
  modules: {
    duration: string;
    title: string;
    isFree: boolean;
  }[];
  relatedCourses: string[];
  author: string;
  time: string;
  id: number;
  title: string;
  subtitle: string;
  image: string;
  number: string;
  type: string;
  issuer: string;
  sector: string;
  jurisdiction: string;
  status: "Berlaku" | "Dicabut" | "Draft";
  publishedAt: string;
  effectiveAt: string;
  summary: string;
  keywords?: string[];
  sourceUrl?: string;
  attachments?: {
    filename: string;
    url: string;
  }[];
  sections?: {
    title: string;
    description: string;
  }[];
  relatedRegulations?: {
    id: number;
    title: string;
  }[];
}
