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
import { DashboardCard } from "@/views/apps/dashboard/dashboard-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { AllProject } from "@/types/projects";

// Dashboard project data type
interface DashboardProject {
  // Core properties from AllProject
  aplication_form: string;
  iso_standards: string;
  accreditation: string;
  customer_id: string;
  customer: string;
  // Tahapan/Phase properties
  tahapan?: string;
  // Certificate dates
  tgl_kirim_sertifikat?: string;
  tgl_persetujuan_draft_sertifikat?: string;
  tgl_pengiriman_draft_sertifikat?: string;
  // Audit dates
  tgl_pelaksanaan_audit?: string;
  tgl_pelaksanaan_audit_st_satu?: string;
  tgl_pelaksanaan_audit_st_dua?: string;
  // Metadata
  sertifikat?: string[] | Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
  // Allow other properties as string
  [key: string]: string | string[] | Record<string, unknown> | undefined;
}

import {
  Building2,
  FileCheck,
  Clock,
  TrendingUp,
  // Users,
  // Award,
  Calendar,
  // AlertCircle,
  CheckCircle,
  FileText,
  Loader2
} from "lucide-react";

// Skeleton component for loading state
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Summary Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="size-9 rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 bg-muted rounded" />
                  <div className="h-6 w-16 bg-muted rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Completion Rate Skeleton */}
        <Card className="lg:col-span-1 animate-pulse">
          <CardHeader className="pb-4">
            <div className="h-5 w-32 bg-muted rounded mb-2" />
            <div className="h-4 w-48 bg-muted rounded" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="h-8 w-20 bg-muted rounded" />
                <div className="h-4 w-16 bg-muted rounded" />
              </div>
              <div className="h-3 w-full bg-muted rounded" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>

        {/* Phase Distribution Skeleton */}
        <Card className="lg:col-span-2 animate-pulse">
          <CardHeader className="pb-4">
            <div className="h-5 w-48 bg-muted rounded mb-2" />
            <div className="h-4 w-64 bg-muted rounded" />
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-muted" />
                    <div className="h-4 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-5 w-8 bg-muted rounded" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Table Skeleton */}
      <Card className="animate-pulse">
        <CardHeader className="to-indigo-600 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 rounded-lg size-7" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-white/20 rounded" />
              <div className="h-4 w-64 bg-white/20 rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  const router = useRouter();
  const { status } = useSession();

  // Always refetch on mount - like refresh halaman
  const {
    data: dateCustomer,
    isLoading: isLoadingDateCustomer,
    isFetching: isFetchingDateCustomer,
    refetch: refetchDateCustomer
  } = useDateCustomerQuery({
    staleTime: 0, // Always consider data stale
    refetchOnMount: false, // Manual refetch
    retry: 2,
  });

  const {
    data: standards,
    isLoading: isLoadingStandards,
    isFetching: isFetchingStandards,
    refetch: refetchStandards
  } = useDataStandardQuery({
    staleTime: 0, // Always consider data stale
    refetchOnMount: false, // Manual refetch
    retry: 2,
  });

  // Force refetch on mount
  useEffect(() => {
    refetchDateCustomer();
    refetchStandards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intentionally empty - only run on mount

  // Simple loading logic
  const isLoading = isLoadingDateCustomer || isLoadingStandards;
  const isRefetching = isFetchingDateCustomer || isFetchingStandards;

  const uniqueStandards = useMemo(() => {
    if (!standards) return [];
    const allStandards = standards.flatMap(
      (item: { standard_name: string }) => item?.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  const dataStandar = uniqueStandards ?? [];
  const data = useMemo(() => {
    // Handle different response structures
    if (!dateCustomer) return [];
    if (Array.isArray(dateCustomer)) return dateCustomer;
    if (dateCustomer?.data && Array.isArray(dateCustomer.data)) return dateCustomer.data;
    return [];
  }, [dateCustomer]) as DashboardProject[];

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    // Ensure data is an array and filter out null/undefined items
    const validData = Array.isArray(data) ? data.filter((item): item is DashboardProject => item != null) : [];

    const totalProjects = validData.length;

    // Completed projects: projects that have certificate issued (tgl_kirim_sertifikat exists)
    const completedProjects = validData.filter((item: DashboardProject) =>
      item?.tgl_kirim_sertifikat && item.tgl_kirim_sertifikat !== ''
    ).length;

    // Surveillance projects: projects in surveilance1-5 phase (tahapan id 2-6)
    const surveillanceProjects = validData.filter((item: DashboardProject) => {
      const tahapan = item?.tahapan?.toLowerCase() || '';
      return tahapan.includes('surveilance') ||
             tahapan.includes('surveillance') ||
             tahapan === 'surveilance1' ||
             tahapan === 'surveilance2' ||
             tahapan === 'surveilance3' ||
             tahapan === 'surveilance4' ||
             tahapan === 'surveilance5';
    }).length;

    // Total certificates: count projects with issued certificates
    const totalCertificates = validData.filter((item: DashboardProject) =>
      item?.tgl_kirim_sertifikat && item.tgl_kirim_sertifikat !== ''
    ).length;

    // Phase distribution using normalized tahapan names
    const tahapanCounts = validData.reduce((acc, item: DashboardProject) => {
      const tahapanRaw = item?.tahapan || 'unknown';

      // Normalize tahapan to display names
      let displayName = 'Unknown';
      const tahapanLower = tahapanRaw.toLowerCase();

      if (tahapanLower === 'ia' || tahapanLower.includes('initial') || tahapanLower.includes('audit')) {
        displayName = 'Initial Audit';
      } else if (tahapanLower.includes('surveilance1') || tahapanLower.includes('surveillance1') || tahapanLower === 'sv1') {
        displayName = 'Surveillance 1';
      } else if (tahapanLower.includes('surveilance2') || tahapanLower.includes('surveillance2') || tahapanLower === 'sv2') {
        displayName = 'Surveillance 2';
      } else if (tahapanLower.includes('surveilance3') || tahapanLower.includes('surveillance3') || tahapanLower === 'sv3') {
        displayName = 'Surveillance 3';
      } else if (tahapanLower.includes('surveilance4') || tahapanLower.includes('surveillance4') || tahapanLower === 'sv4') {
        displayName = 'Surveillance 4';
      } else if (tahapanLower.includes('surveilance5') || tahapanLower.includes('surveillance5') || tahapanLower === 'sv5') {
        displayName = 'Surveillance 5';
      } else if (tahapanLower.includes('recertification') || tahapanLower === 'rc') {
        displayName = 'Recertification';
      } else if (tahapanLower.includes('special') || tahapanLower === 'sp') {
        displayName = 'Special Audit';
      } else if (tahapanLower !== 'unknown') {
        displayName = tahapanRaw;
      }

      acc[displayName] = (acc[displayName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent projects based on latest activity
    const recentProjects = validData
      .filter((item: DashboardProject) => {
        // Get the latest date from any field
        const dates = [
          item?.updated_at,
          item?.created_at,
          item?.tgl_kirim_sertifikat,
          item?.tgl_persetujuan_draft_sertifikat,
          item?.tgl_pengiriman_draft_sertifikat,
          item?.tgl_pelaksanaan_audit,
          item?.tgl_pelaksanaan_audit_st_satu,
          item?.tgl_pelaksanaan_audit_st_dua,
        ].filter(Boolean);
        return dates.length > 0;
      })
      .map((item: DashboardProject) => {
        // Find the latest date
        const dates = [
          { date: item?.updated_at, field: 'updated_at' },
          { date: item?.created_at, field: 'created_at' },
          { date: item?.tgl_kirim_sertifikat, field: 'tgl_kirim_sertifikat' },
          { date: item?.tgl_persetujuan_draft_sertifikat, field: 'tgl_persetujuan_draft_sertifikat' },
          { date: item?.tgl_pengiriman_draft_sertifikat, field: 'tgl_pengiriman_draft_sertifikat' },
          { date: item?.tgl_pelaksanaan_audit, field: 'tgl_pelaksanaan_audit' },
          { date: item?.tgl_pelaksanaan_audit_st_satu, field: 'tgl_pelaksanaan_audit_st_satu' },
          { date: item?.tgl_pelaksanaan_audit_st_dua, field: 'tgl_pelaksanaan_audit_st_dua' },
        ].filter(d => d?.date);

        const latest = dates.reduce((latest, current) => {
          const currentDate = new Date(current.date || 0);
          const latestDate = new Date(latest.date || 0);
          return currentDate.getTime() > latestDate.getTime() ? current : latest;
        }, dates[0] || { date: item?.created_at || item?.updated_at || '0', field: 'created_at' });

        return {
          ...item,
          latestDate: latest.date,
          latestField: latest.field,
        };
      })
      .sort((a, b) => {
        const dateA = new Date((a as DashboardProject & { latestDate?: string }).latestDate || 0);
        const dateB = new Date((b as DashboardProject & { latestDate?: string }).latestDate || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5)
      .map(({ latestDate, latestField, ...rest }) => rest);

    return {
      totalProjects,
      completedProjects,
      surveillanceProjects,
      totalCertificates,
      tahapanCounts,
      recentProjects,
      completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0
    };
  }, [data]);

  // const getProgressByTahapan = (tahapan: string) => {
  //   const progressMap: Record<string, number> = {
  //     'survilance1': 20,
  //     'survilance2': 40,
  //     'survilance3': 60,
  //     'survilance4': 80,
  //     'survilance5': 95,
  //     'sertifikat': 100,
  //     'selesai': 100,
  //     'audit1': 15,
  //     'audit2': 30,
  //     'survei': 10
  //   };
  //   return progressMap[tahapan] || 0;
  // };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Show skeleton during initial load
  if (isLoading) {
    return (
      <DashboardLayout
        href="/apps/dashboard"
        titleHeader="Dashboard"
        subTitleHeader="Monitoring Overview"
        menuSidebar={SidebarAppsMenu as AppSidebarTypes}
      >
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      href="/apps/dashboard"
      titleHeader="Dashboard"
      subTitleHeader="Monitoring Overview"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
      {/* Refetching indicator */}
      {isRefetching && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 animate-pulse">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Updating data...</span>
        </div>
      )}

      <div className="space-y-8">
        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Projects"
            value={dashboardStats.totalProjects}
            icon={Building2}
            tooltip="Total number of active projects"
          />
          <DashboardCard
            title="Completed"
            value={dashboardStats.completedProjects}
            icon={CheckCircle}
            tooltip="Projects with certificates issued"
          />
          <DashboardCard
            title="Surveillance"
            value={dashboardStats.surveillanceProjects}
            icon={Clock}
            tooltip="Projects in surveillance phase"
          />
          <DashboardCard
            title="Certificates"
            value={dashboardStats.totalCertificates}
            icon={FileCheck}
            tooltip="Total certificates issued"
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Completion Progress */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Completion Rate
              </CardTitle>
              <CardDescription>
                Overall project completion percentage
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-primary">
                    {dashboardStats.completionRate.toFixed(1)}%
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">
                    {dashboardStats.completedProjects}/{dashboardStats.totalProjects}
                  </span>
                </div>
                <Progress value={dashboardStats.completionRate} className="h-3" />
                <div className="text-xs text-muted-foreground">
                  {dashboardStats.totalProjects - dashboardStats.completedProjects} projects remaining
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase Distribution */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Project Phase Distribution
              </CardTitle>
              <CardDescription>
                Distribution of projects across different phases
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid gap-4 sm:grid-cols-2">
                {Object.entries(dashboardStats.tahapanCounts)
                  .filter(([, count]) => count > 0)
                  .sort(([a], [b]) => {
                    // Custom sort order for phases
                    const order = ['Initial Audit', 'Surveillance 1', 'Surveillance 2', 'Surveillance 3', 'Surveillance 4', 'Surveillance 5', 'Recertification', 'Special Audit'];
                    const indexA = order.indexOf(a);
                    const indexB = order.indexOf(b);
                    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                    if (indexA !== -1) return -1;
                    if (indexB !== -1) return 1;
                    return a.localeCompare(b);
                  })
                  .map(([tahapan, count]) => (
                    <div key={tahapan} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium">
                          {tahapan}
                        </span>
                      </div>
                      <Badge variant="secondary" className="font-semibold">{count}</Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        {/* <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest project updates and activities
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {dashboardStats.recentProjects.length > 0 ? (
              <div className="space-y-3">
                {dashboardStats.recentProjects.map((project, index) => (
                  <div key={index} className="flex items-center justify-between space-x-4 p-4 rounded-lg border hover:bg-muted/30 transition-colors">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <p className="text-sm font-semibold">{project.customer}</p>
                        <Badge variant="outline" className="text-xs">
                          {project.sales_person}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6">
                        <span className="text-xs text-muted-foreground">
                          ISO: {Array.isArray(project.iso_standards)
                            ? project.iso_standards.join(', ')
                            : project.iso_standards}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Phase: {project.tahapan}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress
                        value={getProgressByTahapan(project.tahapan)}
                        className="w-20 h-2"
                      />
                      <span className="text-xs font-medium text-muted-foreground w-12">
                        {getProgressByTahapan(project.tahapan)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                No recent activities found
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Projects Table */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-blue-50/30">
          <CardHeader className="to-indigo-600  rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 rounded-lg backdrop-blur-sm">
                <FileText className="h-7 w-7 " />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Track your certificate</CardTitle>
                <CardDescription className="text-sm mt-2">
                  Complete overview of all projects and certification status
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8" style={{ marginTop:'-70px' }}>
            <AuditStatusView data={data as AllProject[]} uniqueStandards={dataStandar} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
