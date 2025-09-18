"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/layout/dashboard-layout";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import { AuditorsProvider } from "@/context/auditors-context";
import { AuditorsView } from "@/views/apps";

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
      href="/dashboard/auditors"
      titleHeader="Dashboard"
      subTitleHeader="Auditors"
      menuSidebar={SidebarAppsMenu as unknown as AppSidebarTypes}
    >
      <AuditorsProvider>
        <AuditorsView />
      </AuditorsProvider>
    </DashboardLayout>
  );
}
