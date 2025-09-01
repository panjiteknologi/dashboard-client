"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { DataCapa } from "@/constant/capa";
import AuditPlanView from "@/views/apps/audit-process/audit-plan";
import { SidebarAppsMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const { data: standards = [] } = useDataStandardQuery({
    staleTime: 5 * 60 * 1000,
  });

  const uniqueStandards = useMemo(() => {
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/audit-process/audit-plan"
      titleHeader="Audit Plan"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Audit Plan</h1>
        <AuditPlanView data={DataCapa} uniqueStandards={uniqueStandards} />
      </div>
    </DashboardLayout>
  );
}
