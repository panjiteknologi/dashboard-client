"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { DeleteVideoDialog } from "./delete-video-dialog";
import { VideoPreviewDialog } from "./video-preview-dialog";

export function LibraryVideoManagement() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] =
    useState<Id<"libraryVideos"> | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewVideoId, setPreviewVideoId] =
    useState<Id<"libraryVideos"> | null>(null);

  const videos = useQuery(api.libraryVideos.list, { limit: 100 });
  const deleteMutation = useMutation(api.libraryVideos.remove);

  const handleDelete = (id: Id<"libraryVideos">) => {
    setSelectedVideoId(id);
    setDeleteDialogOpen(true);
  };

  const handlePreview = (id: Id<"libraryVideos">) => {
    setPreviewVideoId(id);
    setPreviewDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedVideoId) return;
    try {
      await deleteMutation({ id: selectedVideoId });
      toast.success("Video deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedVideoId(null);
    } catch (error) {
      toast.error("Failed to delete video");
      console.error(error);
    }
  };

  const selectedVideo = selectedVideoId
    ? videos?.find((video) => video._id === selectedVideoId)
    : null;

  return (
    <div className="flex flex-col mx-auto max-w-7xl container gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Library Video Management</h1>
        <Button onClick={() => router.push("/admin/library-video/create")}>
          <PlusIcon className="size-4" />
          Create Video
        </Button>
      </div>

      {videos === undefined ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-full" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-64" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          No videos found. Create your first video.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Sub Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video._id}>
                  <TableCell className="font-medium">{video.title}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {video.description}
                  </TableCell>
                  <TableCell>
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {video.url}
                    </a>
                  </TableCell>
                  <TableCell>
                    <VideoSubCategoryName subCategoryId={video.subCategoryId} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handlePreview(video._id)}
                        title="Preview"
                      >
                        <EyeIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/admin/library-video/${video._id}`)
                        }
                        title="Edit"
                      >
                        <PencilIcon className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(video._id)}
                        title="Delete"
                      >
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {selectedVideo && (
        <DeleteVideoDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          videoTitle={selectedVideo.title}
          onConfirm={handleConfirmDelete}
        />
      )}

      <VideoPreviewDialog
        open={previewDialogOpen}
        onOpenChange={setPreviewDialogOpen}
        videoId={previewVideoId}
      />
    </div>
  );
}

// Helper component to display subcategory name
function VideoSubCategoryName({
  subCategoryId,
}: {
  subCategoryId: Id<"videoSubCategories">;
}) {
  const subCategory = useQuery(api.videoSubCategories.get, {
    id: subCategoryId,
  });
  return <span>{subCategory?.name || "Loading..."}</span>;
}
