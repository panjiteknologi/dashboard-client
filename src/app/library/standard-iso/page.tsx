"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { StandardISOListView } from "@/views/apps";
import { SidebarAppsMenu } from "@/utils";

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
      href="/library/standard-iso"
      titleHeader="Standard ISO"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-md font-bold">Daftar Standar ISO</h1>
        </div>
        <StandardISOListView />
      </div>
    </DashboardLayout>
  );
}
