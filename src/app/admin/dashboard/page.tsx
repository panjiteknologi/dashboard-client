"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import AdminLayout from "@/layout/admin-layout.tsx";
import { DashboardCard } from "@/views/apps/dashboard/dashboard-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Newspaper,
  Video,
  FileText,
  FolderOpen,
  FolderTree,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardPage() {
  const stats = useQuery(api.dashboard.getStats);

  return (
    <AdminLayout>
      <div className="flex flex-col mx-auto container max-w-5xl gap-6 p-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Ringkasan statistik konten dan data
          </p>
        </div>

        {stats === undefined ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Main Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <DashboardCard
                title="Total News"
                value={stats.totals.news}
                icon={Newspaper}
                tooltip="Total berita yang tersedia"
                size="md"
              />
              <DashboardCard
                title="Total Library Videos"
                value={stats.totals.videos}
                icon={Video}
                tooltip="Total video di library"
                size="md"
              />
              <DashboardCard
                title="Total Regulations"
                value={stats.totals.regulations}
                icon={FileText}
                tooltip="Total regulasi yang tersedia"
                size="md"
              />
            </div>

            {/* Status Breakdown */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* News by Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Newspaper className="h-5 w-5" />
                    News by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">
                        Berlaku
                      </div>
                      <div className="text-2xl font-semibold text-green-600">
                        {stats.newsByStatus.Berlaku}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">
                        Dicabut
                      </div>
                      <div className="text-2xl font-semibold text-red-600">
                        {stats.newsByStatus.Dicabut}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Draft</div>
                      <div className="text-2xl font-semibold text-yellow-600">
                        {stats.newsByStatus.Draft}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Regulations by Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Regulations by Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">
                        Berlaku
                      </div>
                      <div className="text-2xl font-semibold text-green-600">
                        {stats.regulationsByStatus.Berlaku}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">
                        Dicabut
                      </div>
                      <div className="text-2xl font-semibold text-red-600">
                        {stats.regulationsByStatus.Dicabut}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-muted-foreground">Draft</div>
                      <div className="text-2xl font-semibold text-yellow-600">
                        {stats.regulationsByStatus.Draft}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Categories */}
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardCard
                title="Video Categories"
                value={stats.categories.videoCategories}
                icon={FolderOpen}
                tooltip="Total kategori video"
                size="sm"
              />
              <DashboardCard
                title="Regulation Categories"
                value={stats.categories.regulationCategories}
                icon={FolderTree}
                tooltip="Total kategori regulasi"
                size="sm"
              />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
