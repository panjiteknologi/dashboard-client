/* eslint-disable @typescript-eslint/no-explicit-any */
import { WebinarsType } from "@/types/projects";
import Image from "next/image";

export default function WebinarsCard({
  data,
  handleClick,
  view,
}: {
  data: WebinarsType;
  handleClick: () => void;
  view: "grid" | "list";
}) {
  const speaker = data.author ?? "Pembicara";
  const sessions =
    typeof (data as any).sessions === "number"
      ? (data as any).sessions
      : // fallback kalau masih ada data lama
        (data as any).chapters ?? 0;

  return (
    <div
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      role="button"
      tabIndex={0}
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
          sizes={view === "list" ? "160px" : "(max-width:768px) 100vw, 33vw"}
          className="object-cover transition-all duration-300 ease-in-out group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col justify-between p-4 space-y-3 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-base line-clamp-2">{data.title}</h3>
          {data.subtitle && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {data.subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {typeof data.students === "number" && (
            <span>👤 {data.students} peserta</span>
          )}
          <span>📚 {sessions} sesi</span>
          {data.time && <span>⏱️ {data.time}</span>}
        </div>

        <div className="flex justify-between items-center">
          {data.level && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 font-medium">
              {data.level}
            </span>
          )}
          {data.price && (
            <span className="text-sm font-semibold text-primary">
              {data.price}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-auto">Oleh {speaker}</p>
      </div>
    </div>
  );
}
