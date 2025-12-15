"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "convex/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import NewsView from "@/views/apps/perks-and-updates/news/news-view";
import { NewsType } from "@/types/news";
import { api } from "../../../../convex/_generated/api";
import { NewsSkeleton } from "@/views/apps";

export default function NewsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [view, setView] = useState<"grid" | "list">("grid");

  const newsList = useQuery(api.news.list, { status: "Berlaku" });

  const isLoading = newsList === undefined;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (isLoading) {
    return (
      <DashboardLayout
        href="/apps/perks-and-updates/news"
        titleHeader="News & Updates"
        subTitleHeader="Berita Terkini PT TSI Sertifikasi Internasional"
        menuSidebar={SidebarAppsMenu as AppSidebarTypes}
      >
        <NewsSkeleton view={view} />
      </DashboardLayout>
    );
  }

  const transformedNews: NewsType[] = newsList.map((news) => ({
    id: news.id,
    title: news.title,
    subtitle: news.subtitle,
    image: news.image || "",
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
  }));

  return (
    <DashboardLayout
      href="/apps/perks-and-updates/news"
      titleHeader="News & Updates"
      subTitleHeader="Berita Terkini PT TSI Sertifikasi Internasional"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <NewsView data={transformedNews} view={view} setView={setView} />
    </DashboardLayout>
  );
}
