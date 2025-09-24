"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { dataWebinars } from "@/constant/webinars";
import { SidebarAppsMenu } from "@/utils";
import { WebinarsListView } from "@/views/apps";

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
      href="/library/webinars"
      titleHeader="Webinars"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <WebinarsListView data={dataWebinars} view={view} setView={setView} />
    </DashboardLayout>
  );
}
