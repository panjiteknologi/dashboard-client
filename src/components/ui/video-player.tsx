import { VideoTypes } from "@/types/options";

interface Props {
  video: VideoTypes;
}

export const VideoPlayer = ({ video }: Props) => {
  return (
    <div className="w-full space-y-4">
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow">
        <iframe
          src={video.url}
          title={video.title}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </div>
  );
};
