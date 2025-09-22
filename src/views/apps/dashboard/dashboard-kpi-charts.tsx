import { TrendingUp, FileWarning, CalendarClock, Users } from "lucide-react";
import { CardSkeleton } from "./dashboard-skeleton";
import { DashboardCard } from "./dashboard-card";

export function DashboardKpiCards({
  loading,
  stats,
}: {
  loading: boolean;
  stats: {
    totalContracts: string;
    expiring60d: string;
    overdue: string;
    auditorsCount: string;
  };
}) {
  return (
    <div className="mt-4 grid gap-2 grid-cols-2 xl:grid-cols-4">
      {loading ? (
        <>
          <CardSkeleton size="sm" />
          <CardSkeleton size="sm" />
          <CardSkeleton size="sm" />
          <CardSkeleton size="sm" />
        </>
      ) : (
        <>
          <DashboardCard
            size="sm"
            title="Total Kontrak"
            value={stats.totalContracts}
            icon={TrendingUp}
            tooltip="Semua kontrak aktif"
          />
          <DashboardCard
            size="sm"
            title="≥ 60 Hari Habis"
            value={stats.expiring60d}
            icon={CalendarClock}
            tooltip="Kontrak akan kedaluwarsa ≤60 hari"
          />
          <DashboardCard
            size="sm"
            title="Kontrak Terlambat"
            value={stats.overdue}
            icon={FileWarning}
            tooltip="Sudah melewati tanggal"
          />
          <DashboardCard
            size="sm"
            title="Jumlah Auditor"
            value={stats.auditorsCount}
            icon={Users}
            tooltip="Auditor terdaftar"
          />
        </>
      )}
    </div>
  );
}
