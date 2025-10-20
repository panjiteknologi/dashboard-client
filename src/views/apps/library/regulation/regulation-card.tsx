import type { ElementType } from "react";
import { RegulationType } from "@/types/projects";
import { cn } from "@/lib/utils";
import {
  Landmark,
  HeartPulse,
  Flame,
  Zap,
  HardHat,
  Award,
  AlertTriangle,
  Book,
} from "lucide-react";

const categoryIcons: { [key: string]: { icon: ElementType; color: string } } = {
  "dasar-kelembagaan": { icon: Landmark, color: "bg-blue-100 text-blue-600" },
  "kesehatan-lingkungan-kerja": { icon: HeartPulse, color: "bg-green-100 text-green-600" },
  "penanggulangan-kebakaran": { icon: Flame, color: "bg-red-100 text-red-600" },
  "listrik-mekanik": { icon: Zap, color: "bg-yellow-100 text-yellow-600" },
  "apd": { icon: HardHat, color: "bg-orange-100 text-orange-600" },
  "standar-iso-mutu": { icon: Award, color: "bg-indigo-100 text-indigo-600" },
  "standar-iso-risiko": { icon: AlertTriangle, color: "bg-purple-100 text-purple-600" },
  "undang-undang/perpuu-terkait-k3": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-smk3": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-keahlian-dan-kelembagaan-k3": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-uap": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-bejana-tekanan-dan-tangki-timbun": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-pesawat-angkat-dan-pesawat-angkut": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-pesawat-tenaga-dan-produksi": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-konstruksi-dan-bangunan": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-listrik-dan-penyalur-petir": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-elevator-dan-eskalator": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-kesehatan-kerja": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-ergonomi-dan-lingkungan-kerja": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-bahan-berbahaya": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "user-guide": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "surat-edaran": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "infografis": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-penanggulangan-kebakaran": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-apd": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-pengelasan": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "skkni-/-sni": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-penyelaman": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "pedoman-keselamatan-dan-keselamatan-k3-(apd)terkait-bidang-konstruksi-dan-bangunan": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "norma,-standar,-pedoman,-kriteria-(nspk)-k3-terkait-bidang-perusahaan-jasa-k3": { icon: Book, color: "bg-slate-100 text-slate-600" },
  "default": { icon: Book, color: "bg-slate-100 text-slate-600" },
};

const RegulationIcon = ({ subCategoryId }: { subCategoryId: string }) => {
  const details = categoryIcons[subCategoryId] || categoryIcons.default;
  const Icon = details.icon;
  
  return (
    <div className={cn("flex items-center justify-center h-full w-full", details.color)}>
      <Icon className="w-1/2 h-1/2" />
    </div>
  );
};

export const RegulationCardView = ({
  data,
  handleClick,
  view,
  subCategoryId,
}: {
  data: RegulationType;
  handleClick: () => void;
  view: "grid" | "list";
  subCategoryId: string;
}) => {
  const statusStyle = {
    Berlaku: "bg-emerald-100 text-emerald-800",
    Dicabut: "bg-rose-100 text-rose-800",
    Draft: "bg-amber-100 text-amber-800",
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "cursor-pointer group border border-slate-200 rounded-lg overflow-hidden transition-all duration-200 bg-white",
        "hover:shadow-lg hover:border-slate-300",
        view === "list"
          ? "flex flex-row h-32 shadow-sm"
          : "flex flex-col h-full shadow-sm"
      )}
    >
      {/* Icon Container */}
      <div
        className={cn(
          "relative flex-shrink-0",
          view === "list" ? "w-32 h-full" : "h-36"
        )}
      >
        <RegulationIcon subCategoryId={subCategoryId} />
      </div>

      {/* Content Container */}
      <div className="flex flex-col justify-between p-3 flex-1">
        {/* Title and Subtitle */}
        <div className="space-y-1">
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 text-slate-800">
            {data.title}
          </h3>
          {data.subtitle && (
            <p className="text-xs text-slate-500 line-clamp-2">
              {data.subtitle}
            </p>
          )}
        </div>

        {/* Footer with minimal info */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs mt-2">
          {data.number && (
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
              {data.number}
            </span>
          )}
          {data.status && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full font-semibold",
                statusStyle[data.status]
              )}
            >
              {data.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
