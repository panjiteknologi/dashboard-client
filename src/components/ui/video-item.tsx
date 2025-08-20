import { useState } from "react";
import { VideoTypes } from "@/types/options";

type VideoItemProps = {
  video: VideoTypes;
  onSelect?: (video: VideoTypes) => void;
  videoLeft?: boolean;
};

export const VideoItem = ({ video, onSelect, videoLeft }: VideoItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (onSelect) onSelect(video);
  };

  return (
    <div
      className={
        videoLeft
          ? "flex gap-3 items-start rounded-md overflow-hidden transition cursor-pointer"
          : "rounded-md overflow-hidden hover:bg-muted transition p-2 cursor-pointer"
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div
        className={`aspect-video rounded-md overflow-hidden bg-black ${
          videoLeft ? "w-32 mb-0" : "w-full mb-2"
        } `}
      >
        {isHovered ? (
          <iframe
            className="w-full h-full pointer-events-none"
            src={`${video.url}?autoplay=1&mute=1&controls=0`}
            title={video.title}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <img
            src={`https://img.youtube.com/vi/${extractYouTubeId(
              video.url
            )}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <div className="flex flex-col justify-between text-sm overflow-hidden">
        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {video.description}
        </p>
      </div>
    </div>
  );
};

function extractYouTubeId(url: string) {
  const match = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : "";
}
