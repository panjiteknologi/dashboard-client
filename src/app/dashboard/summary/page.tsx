"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import { SummaryProvider } from "@/context/summary-context";
import { SummaryView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/dashboard/summary"
      titleHeader="Dashboard"
      subTitleHeader="Summary"
      menuSidebar={SidebarAppsMenu as unknown as AppSidebarTypes}
    >
      <SummaryProvider>
        <SummaryView />
      </SummaryProvider>
    </DashboardLayout>
  );
}
