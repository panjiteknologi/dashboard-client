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
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Skeleton component for CAPA & Report page
function CapaReportSkeleton() {
  return (
    <div className="space-y-6 max-w-screen">
      {/* Filter bar skeleton */}
      <Card className="p-4 animate-pulse">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-lg">
            <div className="h-9 w-full bg-muted rounded-xl" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-36 bg-muted rounded-xl" />
          </div>
        </div>
      </Card>

      {/* Table skeleton */}
      <Card className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 border-b">
            <div className="h-4 w-32 bg-muted rounded" />
          </div>

          {/* Rows */}
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 border-b last:border-0">
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 bg-muted rounded" />
                <div className="h-3 w-48 bg-muted rounded" />
              </div>
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  // Always refetch on mount - like refresh halaman
  const {
    data: standards,
    isLoading: isLoadingStandards,
    isFetching: isFetchingStandards,
    error: errorStandards,
    refetch: refetchStandards
  } = useDataStandardQuery({
    staleTime: 0, // Always consider data stale
    refetchOnMount: false, // Manual refetch
    retry: 2,
  });

  const {
    data: reportList,
    isLoading: isLoadingReports,
    isFetching: isFetchingReports,
    error: errorReports,
    refetch: refetchReports
  } = useDataReportListQuery({
    staleTime: 0, // Always consider data stale
    refetchOnMount: false, // Manual refetch
    retry: 2,
  });

  // Force refetch on mount
  useEffect(() => {
    refetchStandards();
    refetchReports();
  }, []);

  // Simple loading logic
  const isLoading = isLoadingStandards || isLoadingReports;
  const isRefetching = isFetchingStandards || isFetchingReports;


  const uniqueStandards = useMemo(() => {
    if (!standards) return [];
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item?.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  const capaData = useMemo(() => {
    // Handle different response structures
    let list: ReportList[] = [];

    if (!reportList) {
      list = [];
    } else if (Array.isArray(reportList)) {
      list = reportList;
    } else if (reportList.data && Array.isArray(reportList.data)) {
      list = reportList.data;
    } else {
      list = [];
    }

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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show skeleton during initial load
  if (isLoading) {
    return (
      <DashboardLayout
        href="/apps/audit-process/capa-and-report"
        titleHeader="Capa & Report"
        subTitleHeader="Table"
        menuSidebar={SidebarAppsMenu as AppSidebarTypes}
      >
        <CapaReportSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      href="/apps/audit-process/capa-and-report"
      titleHeader="Capa & Report"
      subTitleHeader="Table"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-md font-bold">Capa & Report</h1>
          {/* Refetching indicator */}
          {isRefetching && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Updating...</span>
            </div>
          )}
        </div>
        <CapaReportView
          data={capaData as CapaTypes[]}
          uniqueStandards={uniqueStandards}
          loading={false} // Don't show internal loading since we handle it
        />
      </div>
    </DashboardLayout>
  );
}
