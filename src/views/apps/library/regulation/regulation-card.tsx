import { RegulationType } from "@/types/projects";
import Image from "next/image";

export default function RegulationCardView({
  data,
  handleClick,
  view,
}: {
  data: RegulationType;
  handleClick: () => void;
  view: "grid" | "list";
}) {
  const statusStyle =
    data.status === "Berlaku"
      ? "bg-emerald-100 text-emerald-700"
      : data.status === "Dicabut"
      ? "bg-rose-100 text-rose-700"
      : "bg-amber-100 text-amber-800";

  return (
    <div
      onClick={handleClick}
      className={`cursor-pointer group border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all bg-white ${
        view === "list" ? "flex flex-row h-40" : "flex flex-col h-full"
      }`}
    >
      <div
        className={`${
          view === "list" ? "w-40 h-full" : "h-40"
        } relative flex-shrink-0`}
      >
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-between p-4 gap-3 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-base line-clamp-2">{data.title}</h3>
          {data.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {data.number && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
              {data.number}
            </span>
          )}
          {data.type && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {data.type}
            </span>
          )}
          {data.jurisdiction && (
            <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700">
              {data.jurisdiction}
            </span>
          )}
          {data.status && (
            <span
              className={`px-2 py-1 rounded-full font-medium ${statusStyle}`}
            >
              {data.status}
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          {data.issuer && (
            <div className="truncate">
              <span className="font-medium text-gray-700">Penerbit:</span>{" "}
              {data.issuer}
            </div>
          )}
          {data.sector && (
            <div className="truncate">
              <span className="font-medium text-gray-700">Sektor:</span>{" "}
              {data.sector}
            </div>
          )}
          {data.effectiveAt && (
            <div className="truncate">
              <span className="font-medium text-gray-700">Berlaku:</span>{" "}
              {data.effectiveAt}
            </div>
          )}
          {data.publishedAt && (
            <div className="truncate">
              <span className="font-medium text-gray-700">Terbit:</span>{" "}
              {data.publishedAt}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {Array.isArray(data.keywords) && data.keywords.length > 0 && (
            <span>🔖 {data.keywords.length} kata kunci</span>
          )}
          {Array.isArray(data.attachments) && data.attachments.length > 0 && (
            <span>📎 {data.attachments.length} lampiran</span>
          )}
          {Array.isArray(data.sections) && data.sections.length > 0 && (
            <span>📚 {data.sections.length} seksi</span>
          )}
        </div>
      </div>
    </div>
  );
}
