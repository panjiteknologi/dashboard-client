"use client";

import React, { useState, useEffect } from "react";
import { VideoTypes } from "@/types/options";
import { VideoItem } from "@/components/ui/video-item";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowLeft } from "lucide-react";

const videoData: VideoTypes[] = [
  {
    id: 1,
    title: "Webinar dasar dasar k3 u sawit",
    description: "Webinar dasar dasar k3 u sawit",
    url: "https://www.youtube.com/embed/XnKXs1CfrEA",
  },
  {
    id: 2,
    title: "Tsi talk 3",
    description: "Perubahan 37k versi 2016 dan 2025",
    url: "https://www.youtube.com/embed/67RfluXSUxY",
  },
  {
    id: 3,
    title: "Edukasi Animasi TSI - Cara Memilih TBS",
    description: "Edukasi Animasi TSI - Cara Memilih TBS",
    url: "https://www.youtube.com/embed/C2GMvj_LH9I",
  },
  {
    id: 4,
    title: "Animasi Edukasi TSI - Job Safety Analysis",
    description: "Animasi Edukasi TSI - Job Safety Analysis",
    url: "https://www.youtube.com/embed/n73Kz44Wmdw",
  },
  {
    id: 5,
    title: "Animasi Edukasi TSI - Lock Out Take Out",
    description: "Animasi Edukasi TSI - Lock Out Take Out",
    url: "https://www.youtube.com/embed/8DjD26UKgXg",
  }
];

export const VideoListView = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoTypes | null>(null);
  const [isWide, setIsWide] = useState(false);

  // Separate videos by category
  const webinarVideos = videoData.filter(v => v.id <= 2);
  const animationVideos = videoData.filter(v => v.id >= 3);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") {
        setIsWide((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div className="space-y-6 max-w-screen">
      {!selectedVideo ? (
        <div className="space-y-8">
          {/* Webinar Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              📺 Webinar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {webinarVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="cursor-pointer"
                >
                  <VideoItem video={video} />
                </div>
              ))}
            </div>
          </div>

          {/* Animation Section */}
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
              🎬 Animasi Edukasi
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {animationVideos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className="cursor-pointer"
                >
                  <VideoItem video={video} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedVideo(null)}
              className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to list
            </button>
          </div>
          {isWide ? (
            <div>
              <VideoPlayer video={selectedVideo} />
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {videoData.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedVideo(item)}
                    className="cursor-pointer"
                  >
                    <VideoItem video={item} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="lg:w-[70%]">
                <VideoPlayer video={selectedVideo} />
              </div>
              <div className="lg:w-[30%] space-y-4 overflow-y-auto max-h-[75vh] pr-1">
                {videoData.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className="cursor-pointer hover:bg-muted p-2 rounded-lg transition"
                  >
                    <VideoItem video={video} videoLeft />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
