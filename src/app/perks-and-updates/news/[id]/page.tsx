"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { ArrowLeft } from "lucide-react";
import { dataNews } from "@/constant/news";
import { SidebarAppsMenu } from "@/utils";
import { NewsDetailView } from "@/views/apps";
import { NewsType } from "@/types/news";

export default function NewsDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = useState<NewsType | null>(null);

  const goBack = () => router.push("/perks-and-update/news");

  useEffect(() => {
    if (!id) return;
    const numericId = Number(id);
    const news = dataNews.find((w) => w.id === numericId) || null;
    setData(news);
  }, [id]);

  if (!id) {
    return <div className="p-6">Parameter ID tidak valid.</div>;
  }

  if (!data) {
    return <div className="p-6">News tidak ditemukan…</div>;
  }

  return (
    <DashboardLayout
      href={`/perks-and-update/news/${id}`}
      titleHeader="Detail News"
      subTitleHeader={data.title}
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

      <NewsDetailView data={data} />
    </DashboardLayout>
  );
}
