"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { VideoToggleView } from "@/views/apps/library/video-k3/video-toogle";
import { VideoCardView } from "@/views/apps/library/video-k3/video-card";
import { VideoTypes } from "@/types/options";

type VideoPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: Id<"libraryVideos"> | null;
};

export function VideoPreviewDialog({
  open,
  onOpenChange,
  videoId,
}: VideoPreviewDialogProps) {
  const [view, setView] = useState<"grid" | "list">("grid");

  const video = useQuery(
    api.libraryVideos.get,
    videoId ? { id: videoId } : "skip"
  );

  // Transform Convex video to VideoTypes
  const transformedVideo: VideoTypes | null = video
    ? {
        id: video.id,
        title: video.title,
        description: video.description,
        url: video.url,
      }
    : null;

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setView("grid");
    }
    onOpenChange(newOpen);
  };

  if (!transformedVideo || !video) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview Video</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="flex justify-end">
            <VideoToggleView view={view} setView={setView} />
          </div>

          <div>
            <VideoCardView
              data={transformedVideo}
              handleClick={() => {}}
              view={view}
              subCategoryId={(video.subCategoryId ?? "") as string}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
