"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";

export default function DashboardPage() {
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
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as unknown as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Dashboard</h1>
      </div>
    </DashboardLayout>
  );
}
