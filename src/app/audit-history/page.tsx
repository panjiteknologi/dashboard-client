"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarAppsMenu } from "@/utils";
import type { AppSidebarTypes } from "@/types/sidebar-types";
import { AuditHistoryView } from "@/views/apps";
import { AuditHistoryProvider } from "@/context/audit-history-context";

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
      href="/audit-history"
      titleHeader="Audit History"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <AuditHistoryProvider>
          <AuditHistoryView />
        </AuditHistoryProvider>
      </div>
    </DashboardLayout>
  );
}
