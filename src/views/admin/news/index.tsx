"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewsTable } from "./news-table";
import { DeleteNewsDialog } from "./delete-news-dialog";

export function NewsManagement() {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState<Id<"news"> | null>(null);

  const newsList = useQuery(api.news.list, { limit: 100 });
  const deleteMutation = useMutation(api.news.remove);

  const handleDelete = (id: Id<"news">) => {
    setSelectedNewsId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedNewsId) return;
    try {
      await deleteMutation({ id: selectedNewsId });
      toast.success("News deleted successfully");
      setDeleteDialogOpen(false);
      setSelectedNewsId(null);
    } catch (error) {
      toast.error("Failed to delete news");
      console.error(error);
    }
  };

  const selectedNews = selectedNewsId
    ? newsList?.find((news) => news._id === selectedNewsId)
    : null;

  return (
    <div className="flex flex-col mx-auto max-w-7xl container gap-4 mt-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News Management</h1>
        <Button onClick={() => router.push("/admin/news/create")}>
          <PlusIcon className="size-4" />
          Create News
        </Button>
      </div>

      <NewsTable
        news={newsList ?? []}
        isLoading={newsList === undefined}
        onDelete={handleDelete}
      />

      {selectedNews && (
        <DeleteNewsDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          newsTitle={selectedNews.title}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
