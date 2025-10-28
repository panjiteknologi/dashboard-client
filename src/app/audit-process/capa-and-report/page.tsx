"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/layout/dashboard-layout";
import { useDataStandardQuery } from "@/hooks/use-standard";
import { useDataReportListQuery } from "@/hooks/use-report-list";
import { CapaTypes, ReportList } from "@/types/projects";
import { SidebarAppsMenu } from "@/utils";
import { AppSidebarTypes } from "@/types/sidebar-types";
import { CapaReportView } from "@/views/apps/audit-process";

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  const { data: standards = [] } = useDataStandardQuery({
    staleTime: 5 * 60 * 1000,
  });

  const { data: reportList, isLoading } = useDataReportListQuery({});


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

  const capaData = useMemo(() => {
    const list = Array.isArray(reportList)
      ? reportList
      : reportList?.data || [];
    return list.map((report: ReportList) => ({
      id: report.id,
      document_no: report.name,
      customer: report.customer?.name,
      reference: report.iso_reference?.name,
      standards:
        report.iso_standards_ids?.map(
          (standard: { id: number; name: string }) => standard.name
        ) || [],
      audit_stage: report.audit_stage,
      status: report.state,
      category: "report",
      total_employee: undefined, // Not in API response
      boundaries: undefined, // Not in API response
      scope: undefined, // Not in API response
      document_audit: {
        audit_plan: report.audit_plan_file_name,
        attendance_sheet: report.attendance_sheet_file_name,
        audit_report: report.audit_report_file_name,
        close_findings: report.capa_file_name,
      },
      log_notes: report.log_notes,
    }));
  }, [reportList]);

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
          data={capaData as CapaTypes[]}
          uniqueStandards={uniqueStandards}
          loading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}
