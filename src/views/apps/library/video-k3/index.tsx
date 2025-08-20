"use client";

import React, { useState, useEffect } from "react";
import { VideoTypes } from "@/types/options";
import { VideoItem } from "@/components/ui/video-item";
import { VideoPlayer } from "@/components/ui/video-player";
import { ArrowLeft } from "lucide-react"; // pastikan lucide-react sudah diinstal

const videoData: VideoTypes[] = [
  {
    id: 1,
    title: "Workplace Safety",
    description: "Stay safe at work",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    title: "Code of Conduct",
    description: "Company rules overview",
    url: "https://www.youtube.com/embed/tgbNymZ7vqY",
  },
  {
    id: 3,
    title: "Compliance Training",
    description: "Ethical standards",
    url: "https://www.youtube.com/embed/oHg5SJYRHA0",
  },
  {
    id: 4,
    title: "Cybersecurity",
    description: "Protecting digital assets",
    url: "https://www.youtube.com/embed/aqz-KE-bpKQ",
  },
];

export default function VideoListView() {
  const [selectedVideo, setSelectedVideo] = useState<VideoTypes | null>(null);
  const [isWide, setIsWide] = useState(false);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {videoData.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="cursor-pointer"
            >
              <VideoItem video={video} />
            </div>
          ))}
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
}
