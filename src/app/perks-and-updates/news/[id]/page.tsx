"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { ArrowLeft } from "lucide-react";
import { SidebarAppsMenu } from "@/utils";
import { NewsDetailView } from "@/views/apps";
import { NewsType } from "@/types/news";

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  // Get image URL query for Convex storage
  // const getImageUrl = useQuery(api.news.getImageUrl);

  // Fetch news from Convex by ID
  const news = useQuery(api.news.get, id ? { id: id as Id<"news"> } : "skip");

  // Get image URL if storage ID exists
  const imageUrl = useQuery(
    api.news.getImageUrl,
    news?.imageStorageId ? { storageId: news.imageStorageId } : "skip"
  );

  // Transform Convex news to NewsType format
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

  const goBack = () => router.push("/perks-and-updates/news");

  if (!id) {
    return <div className="p-6">Parameter ID tidak valid.</div>;
  }

  if (!transformedNews) {
    return <div className="p-6">News tidak ditemukan…</div>;
  }

  return (
    <DashboardLayout
      href={`/perks-and-updates/news/${id}`}
      titleHeader="Detail News"
      subTitleHeader={transformedNews.title}
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="flex items-center gap-2">
        <button
          onClick={goBack}
          className="cursor-pointer flex items-center gap-1 text-sm text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke daftar
        </button>
      </div>

      <NewsDetailView data={transformedNews} />
    </DashboardLayout>
  );
}
