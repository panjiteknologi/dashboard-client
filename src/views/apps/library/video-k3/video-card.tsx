/* eslint-disable @next/next/no-img-element */
import React from "react";
import { VideoTypes } from "@/types/options";
import { PlayCircle } from "lucide-react";

interface VideoCardViewProps {
  data: VideoTypes;
  view: "grid" | "list";
  handleClick: () => void;
  subCategoryId: string;
}

export const VideoCardView = ({
  data,
  view,
  handleClick,
}: VideoCardViewProps) => {
  const getYouTubeThumbnail = (url: string) => {
    let videoId = url.split("embed/")[1];
    if (videoId.includes("?")) {
      videoId = videoId.split("?")[0];
    }
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  };

  // Tampilan LIST (tetap seperti sebelumnya)
  if (view === "list") {
    return (
      <div
        onClick={handleClick}
        className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors duration-150 border border-slate-200 bg-white"
      >
        <div className="relative flex-shrink-0 w-32 h-20 rounded-md overflow-hidden bg-slate-200 group">
          <img
            src={getYouTubeThumbnail(data.url)}
            alt={data.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <PlayCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-base text-slate-800 line-clamp-2">
            {data.title}
          </h3>
          <p className="text-sm text-slate-600 line-clamp-1">
            {data.description}
          </p>
        </div>
      </div>
    );
  }

  // Tampilan GRID (YouTube-style)
  return (
    <div
      onClick={handleClick}
      className="group w-full cursor-pointer transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-slate-200 shadow-md">
        <img
          src={getYouTubeThumbnail(data.url)}
          alt={data.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-all duration-300">
          <PlayCircle className="w-12 h-12 text-white drop-shadow-md" />
        </div>
      </div>

      <div className="mt-2 px-1">
        <h3 className="font-medium text-[15px] text-slate-800 leading-snug line-clamp-2">
          {data.title}
        </h3>
        <p className="text-sm text-slate-600 mt-1 line-clamp-1">
          {data.description}
        </p>
      </div>
    </div>
  );
};
