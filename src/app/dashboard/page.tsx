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

// Extended type for dashboard data
interface DashboardProject extends AllProject {
  tahapan?: string;
  sertifikat?: string[] | Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
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
  FileText
} from "lucide-react";

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
      (item: { standard_name: string }) => item?.standard_name || []
    );
    return Array.from(new Set(allStandards));
  }, [standards]);

  const dataStandar = uniqueStandards ?? [];
  const data = useMemo(() => dateCustomer?.data ?? [], [dateCustomer?.data]) as DashboardProject[];

  // Calculate dashboard statistics
  const dashboardStats = useMemo(() => {
    const totalProjects = data.length;
    const completedProjects = data.filter((item: DashboardProject) =>
      item.tahapan?.includes('sertifikat') || item.tahapan?.includes('selesai')
    ).length;
    const surveillanceProjects = data.filter((item: DashboardProject) =>
      item.tahapan?.includes('survilance') || item.tahapan?.includes('sv')
    ).length;
    const totalCertificates = data.reduce((acc, item: DashboardProject) =>
      acc + (Array.isArray(item.sertifikat) ? item.sertifikat.length : 0), 0
    );

    const tahapanCounts = data.reduce((acc, item: DashboardProject) => {
      const tahapan = item.tahapan || 'unknown';
      acc[tahapan] = (acc[tahapan] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recentProjects = data
      .filter((item: DashboardProject) => item.created_at || item.updated_at)
      .sort((a: DashboardProject, b: DashboardProject) => {
        const dateA = new Date(a.updated_at || a.created_at || 0);
        const dateB = new Date(b.updated_at || b.created_at || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);

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

  return (
    <DashboardLayout
      href="/apps/dashboard"
      titleHeader="Dashboard"
      subTitleHeader="Monitoring Overview"
      menuSidebar={SidebarAppsMenu as AppSidebarTypes}
    >
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
                  .sort(([a], [b]) => a.localeCompare(b))
                  .map(([tahapan, count]) => (
                    <div key={tahapan} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-sm font-medium capitalize">
                          {tahapan.replace('survilance', 'Surveillance')}
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
            <AuditStatusView data={data} uniqueStandards={dataStandar} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
