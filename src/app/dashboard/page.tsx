"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import { DashboardView } from "@/views/apps";
import { DashboardProvider } from "@/context/dashboard-context";

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
      href="/dashboard"
      titleHeader="Dashboard"
      subTitleHeader="Dashboard"
      menuSidebar={SidebarAppsMenu as unknown as AppSidebarTypes}
    >
      <DashboardProvider>
        <DashboardView />
      </DashboardProvider>
    </DashboardLayout>
  );
}
