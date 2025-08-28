import { NewsType } from "@/types/projects";
import Image from "next/image";

export default function NewsCard({
  data,
  handleClick,
  view,
}: {
  data: NewsType;
  handleClick: () => void;
  view: "grid" | "list";
}) {
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

      <div className="flex flex-col justify-between p-4 space-y-3 flex-1">
        <div className="space-y-1">
          <h3 className="font-semibold text-base line-clamp-2">{data.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {data.subtitle}
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          <span>👤 {data.students} siswa</span>
          <span>📚 {data.chapters} bab</span>
          <span>⏱️ {data.time}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 font-medium">
            {data.level}
          </span>
          <span className="text-sm font-semibold text-primary">
            {data.price}
          </span>
        </div>

        <p className="text-xs text-muted-foreground mt-auto">
          Oleh {data.author}
        </p>
      </div>
    </div>
  );
}
