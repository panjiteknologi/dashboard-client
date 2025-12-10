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
import NewsCard from "@/views/apps/perks-and-updates/news/news-card";
import NewsDetailView from "@/views/apps/perks-and-updates/news/news-detail";
import { NewsType } from "@/types/news";

type NewsPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsId: Id<"news"> | null;
};

export function NewsPreviewDialog({
  open,
  onOpenChange,
  newsId,
}: NewsPreviewDialogProps) {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [showDetail, setShowDetail] = useState(false);

  const news = useQuery(api.news.get, newsId ? { id: newsId } : "skip");

  const imageUrl = useQuery(
    api.news.getImageUrl,
    news?.imageStorageId ? { storageId: news.imageStorageId } : "skip"
  );

  // Transform Convex news to NewsType
  const transformedNews: NewsType | null = news
    ? {
        id: news.id,
        title: news.title,
        subtitle: news.subtitle,
        image: imageUrl || news.image || "",
        number: news.number,
        type: news.type,
        issuer: news.issuer,
        sector: news.sector,
        jurisdiction: news.jurisdiction,
        status: news.status,
        publishedAt: news.publishedAt,
        effectiveAt: news.effectiveAt,
        summary: news.summary,
        keywords: news.keywords,
        sourceUrl: news.sourceUrl,
        attachments: news.attachments,
        sections: news.sections,
        relatedRegulations: news.relatedRegulations,
        modules: news.modules,
        relatedCourses: news.relatedCourses,
        author: news.author,
        time: news.time,
        students: news.students,
        chapters: news.chapters,
        level: news.level,
        price: news.price,
      }
    : null;

  const handleCardClick = () => {
    setShowDetail(true);
  };

  const handleBackToList = () => {
    setShowDetail(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setShowDetail(false);
      setView("grid");
    }
    onOpenChange(newOpen);
  };

  if (!transformedNews) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[90vw] max-w-none max-h-[90vh] overflow-x-hidden overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preview News</DialogTitle>
        </DialogHeader>

        {showDetail ? (
          <div className="mt-4">
            <button
              onClick={handleBackToList}
              className="mb-4 text-sm text-blue-600 hover:underline"
            >
              ← Kembali ke Preview
            </button>
            <NewsDetailView data={transformedNews} />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <NewsCard
                data={transformedNews}
                handleClick={handleCardClick}
                view={view}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
