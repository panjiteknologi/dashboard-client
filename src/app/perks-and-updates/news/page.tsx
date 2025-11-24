"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { dataNews } from "@/constant/news";
import { SidebarAppsMenu } from "@/utils";
import NewsView from "@/views/apps/perks-and-updates/news/news-view";

export default function NewsPage() {
  const router = useRouter();
  const { status } = useSession();
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/perks-and-updates/news"
      titleHeader="News & Updates"
      subTitleHeader="Berita Terkini PT TSI Sertifikasi Internasional"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <NewsView data={dataNews} view={view} setView={setView} />
    </DashboardLayout>
  );
}
