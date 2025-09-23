"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { DataCapa } from "@/constant/capa";
import { CapaTypes } from "@/types/projects";
import { SidebarAppsMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { CapaReportView } from "@/views/apps/audit-process";

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
      href="/apps/audit-process/capa-and-report"
      titleHeader="Capa & Report"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Capa & Report</h1>
        <CapaReportView
          data={DataCapa as CapaTypes[]}
          uniqueStandards={uniqueStandards}
        />
      </div>
    </DashboardLayout>
  );
}
