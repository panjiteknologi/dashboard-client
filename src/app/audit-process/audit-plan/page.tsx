"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarAppsMenu } from "@/utils";
import type { AppSidebarTypes } from "@/types/sidebar-types";
import { AuditPlanProvider } from "@/context/audit-plan-context";
import { AuditPlanView } from "@/views/apps";

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
      href="/audit-process/audit-plan"
      titleHeader="Audit Plan"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <AuditPlanProvider>
          <AuditPlanView />
        </AuditPlanProvider>
      </div>
    </DashboardLayout>
  );
}
