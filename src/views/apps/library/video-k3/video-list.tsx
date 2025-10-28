"use client";
import React, { useMemo, useState } from "react";

import { VideoTypes } from "@/types/options";
import { VideoToggleView } from "./video-toogle";
import { VideoCardView } from "./video-card";
import { dummyVideoData, VideoCategory } from "@/constant/video-dummy";
import { cn } from "@/lib/utils";
import { ChevronRight, Search } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { VideoPlayer } from "@/components/ui/video-player";

// --- Sidebar Component ---
const VideoSidebar = ({ categories, activeSubCategoryId, onSelectSubCategory }: { categories: VideoCategory[]; activeSubCategoryId: string; onSelectSubCategory: (subCategoryId: string) => void; }) => {
  return (
    <aside className="hidden md:block w-full flex-shrink-0">
      {/* <h2 className="text-base font-semibold mb-4 text-slate-900">Kategori Video</h2> */}
      <nav className="space-y-3">
        {categories.map((category) => (
          <div key={category.id}>
            <h3 className="font-semibold text-sm text-slate-800 mb-2 px-2">{category.name}</h3>
            <ul className="space-y-1 border-l border-slate-200">
              {category.subCategories.map((sub) => (
                <li key={sub.id}>
                  <button
                    onClick={() => onSelectSubCategory(sub.id)}
                    className={cn(
                      "w-full text-left pl-3 -ml-px py-1 text-sm text-slate-600 border-l-2 border-transparent transition-colors duration-150",
                      "hover:text-slate-800 hover:border-slate-400",
                      activeSubCategoryId === sub.id && "font-semibold text-slate-900 border-slate-500 bg-slate-100"
                    )}
                    suppressHydrationWarning
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
};

// --- Breadcrumb Component ---
const VideoBreadcrumb = ({ activeSubCategoryId, selectedVideo, onBackToList }: { activeSubCategoryId: string; selectedVideo: VideoTypes | null; onBackToList: () => void; }) => {
  const { categoryName, subCategoryName } = useMemo(() => {
    for (const category of dummyVideoData) {
      const subCategory = category.subCategories.find((sub) => sub.id === activeSubCategoryId);
      if (subCategory) {
        return { categoryName: category.name, subCategoryName: subCategory.name };
      }
    }
    return { categoryName: "", subCategoryName: "" };
  }, [activeSubCategoryId]);

  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500 overflow-hidden">
      <span className="hidden md:inline">{categoryName}</span>
      <ChevronRight className="h-4 w-4 hidden md:inline" />
      <button onClick={onBackToList} className="hover:text-slate-800 hover:underline disabled:no-underline disabled:text-slate-500 truncate" disabled={!selectedVideo}>
        {subCategoryName}
      </button>
      {selectedVideo && (
        <>
          <ChevronRight className="h-4 w-4 flex-shrink-0" />
          <span className="font-semibold text-slate-700 truncate">{selectedVideo.title}</span>
        </>
      )}
    </div>
  );
};

// --- Video Detail View ---
const VideoDetailView = ({ video }: { video: VideoTypes }) => {
  return (
    <div className="w-full">
        <div className="aspect-video">
            <VideoPlayer video={video} />
        </div>
        <div className="mt-4">
            <h1 className="text-2xl font-bold text-slate-900">{video.title}</h1>
            <p className="text-slate-600 mt-1">{video.description}</p>
        </div>
    </div>
  )
}

// --- Main Content Component ---
const VideoContent = ({ videos, view, selectedVideo, onSelectVideo, subCategoryId }: { videos: VideoTypes[]; view: "grid" | "list"; selectedVideo: VideoTypes | null; onSelectVideo: (video: VideoTypes) => void; subCategoryId: string; }) => {
  if (selectedVideo) {
    const otherVideos = videos.filter(v => v.id !== selectedVideo.id);
    return (
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:flex-grow">
            <VideoDetailView video={selectedVideo} />
        </div>
        <aside className="lg:w-96 flex-shrink-0">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Video Lainnya</h3>
          {otherVideos.length > 0 ? (
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {otherVideos.map((item) => (
                <VideoCardView key={item.id} data={item} handleClick={() => onSelectVideo(item)} view="list" subCategoryId={subCategoryId} />
              ))}
            </div>
          ) : (
            <p className="text-slate-500">Tidak ada video lain di kategori ini.</p>
          )}
        </aside>
      </div>
    );
  }

  if (videos.length > 0) {
    return (
      <div className={`grid ${view === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" : "space-y-3"}`}>
        {videos.map((item) => (
          <VideoCardView key={item.id} data={item} handleClick={() => onSelectVideo(item)} view={view} subCategoryId={subCategoryId} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg bg-slate-50">
      <p className="text-slate-500">Tidak ada video di kategori ini.</p>
    </div>
  );
};

export const VideoListView = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeSubCategoryId, setActiveSubCategoryId] = useState(dummyVideoData[0]?.subCategories[0]?.id ?? "");
  const [selectedVideo, setSelectedVideo] = useState<VideoTypes | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const videosToShow = useMemo(() => {
    if (debouncedSearchQuery) {
      const allVideos = dummyVideoData.flatMap(category =>
        category.subCategories.flatMap(subCategory => subCategory.videos)
      );

      return allVideos.filter(video =>
        video.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    for (const category of dummyVideoData) {
      const subCategory = category.subCategories.find((sub) => sub.id === activeSubCategoryId);
      if (subCategory) {
        return subCategory.videos;
      }
    }

    return [];
  }, [activeSubCategoryId, debouncedSearchQuery]);

  const handleSelectSubCategory = (subId: string) => {
    setActiveSubCategoryId(subId);
    setSelectedVideo(null);
    setSearchQuery("");
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 -mt-[39px] md:mt-0">
      <div className={cn("w-full md:w-64", debouncedSearchQuery && "opacity-50 pointer-events-none")}>
        <VideoSidebar categories={dummyVideoData} activeSubCategoryId={activeSubCategoryId} onSelectSubCategory={handleSelectSubCategory} />
      </div>

      <main className="w-full">
        {/* --- Sticky Header for Mobile --- */}
        <header className="md:hidden sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-slate-200 p-4 -mx-4">
          <div className="flex justify-between items-center mb-3">
            <VideoBreadcrumb activeSubCategoryId={activeSubCategoryId} selectedVideo={selectedVideo} onBackToList={() => setSelectedVideo(null)} />
            {!selectedVideo && <VideoToggleView view={view} setView={setView} />}
          </div>

          {!selectedVideo && (
            <div>
              {/* <label htmlFor="kategori-video-mobile" className="sr-only">Kategori Video</label> */}
              <select
                id="kategori-video-mobile"
                value={activeSubCategoryId}
                onChange={(e) => handleSelectSubCategory(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {dummyVideoData.map((category) => (
                  <optgroup key={category.id} label={category.name}>
                    {category.subCategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}
        </header>

        {/* --- Header for Desktop --- */}
        <header className="hidden md:flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
          <div className="max-w-[500px] truncate">
            <VideoBreadcrumb
              activeSubCategoryId={activeSubCategoryId}
              selectedVideo={selectedVideo}
              onBackToList={() => setSelectedVideo(null)}
            />
          </div>
          {!selectedVideo && <VideoToggleView view={view} setView={setView} />}
        </header>


        {!selectedVideo && (
            <div className="hidden md:flex justify-between items-center mb-4">
                <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                    type="text"
                    placeholder="Cari video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    suppressHydrationWarning
                    />
                </div>
            </div>
        )}

        <div className="p-4 md:p-0 md:pt-4">
          <VideoContent videos={videosToShow} view={view} selectedVideo={selectedVideo} onSelectVideo={setSelectedVideo} subCategoryId={activeSubCategoryId} />
        </div>

        {/* --- Floating Search Input for Mobile --- */}
        {!selectedVideo && (
            <div className="md:hidden fixed bottom-4 left-4 right-4 z-20">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                    type="text"
                    placeholder="Cari video..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border border-slate-300 rounded-full bg-white text-slate-800 shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    suppressHydrationWarning
                    />
                </div>
            </div>
        )}
      </main>
    </div>
  );
};