"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";

import { SidebarAppsMenu } from "@/utils";
import { RegulationListView } from "@/views/apps";

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
      href="/library/regulation"
      titleHeader="Regulation"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <RegulationListView
        view={view}
        setView={setView}
      />
    </DashboardLayout>
  );
}
