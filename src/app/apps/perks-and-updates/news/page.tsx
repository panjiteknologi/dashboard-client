"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import WebinarsView from "@/views/apps/library/webinars";
import { dataWebinars } from "@/constant/webinars";
import { SidebarMenuPerksAndUpdatesMenu } from "@/utils";

export default function RegulationPage() {
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
      titleHeader="News"
      subTitleHeader="Table"
      menuSidebar={SidebarMenuPerksAndUpdatesMenu as AppSidebarTypes}
    >
      <WebinarsView data={dataWebinars} view={view} setView={setView} />
    </DashboardLayout>
  );
}
