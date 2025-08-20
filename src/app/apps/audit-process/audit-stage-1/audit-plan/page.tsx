"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { CapaAndReportMenu } from "@/constant/menu-sidebar";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { useDateCustomerQuery } from "@/hooks/use-date-customer";
import { DataCapa } from "@/constant/capa";
import { CapaTypes } from "@/types/projects";
import AuditPlanView from "@/views/apps/audit-process/audit-plan";

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { data: dateCustomer = [], isLoading } = useDateCustomerQuery({
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
      menuSidebar={CapaAndReportMenu as any}
    >
      <div className="space-y-4">
        <h1 className="text-md font-bold">Audit Plan</h1>
        <AuditPlanView
          data={DataCapa as CapaTypes[]}
          uniqueStandards={uniqueStandards}
        />
      </div>
    </DashboardLayout>
  );
}
