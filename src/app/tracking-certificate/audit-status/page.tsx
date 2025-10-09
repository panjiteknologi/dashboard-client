"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDateCustomerQuery } from "@/hooks/use-date-customer";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { SidebarAppsMenu } from "@/utils";
import DashboardLayout from "@/layout/dashboard-layout";
import { AuditStatusView } from "@/views/apps";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();
  const { data: dateCustomer = [] } = useDateCustomerQuery({
    staleTime: 5 * 60 * 1000,
  });

  const { data: standards = [] } = useDataStandardQuery({
    staleTime: 5 * 60 * 1000,
  });

  const uniqueStandards = useMemo(() => {
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  const dataStandar = uniqueStandards ?? [];
  const data = dateCustomer?.data ?? [];

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  return (
    <DashboardLayout
      href="/apps/audit-status"
      titleHeader="Project Status"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <AuditStatusView data={data} uniqueStandards={dataStandar} />
      </div>
    </DashboardLayout>
  );
}
