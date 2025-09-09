"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { SidebarAppsMenu } from "@/utils";
import type { AppSidebarTypes } from "@/types/sidebar-types";
import AuditPlanView from "@/views/apps/audit-process/audit-plan";

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
      href="/apps/audit-process/capa-report"
      titleHeader="CAPA Report"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Audit Plan</h1>
        <AuditPlanView data={[]} uniqueStandards={[]} />
      </div>
    </DashboardLayout>
  );
}
