"use client";

import { DashboardHeader } from "./dashboard-header";
import { DashboardStateBuckets } from "./dashboard-state-buckets";
import { DashboardReportTimelines } from "./dashboard-report-timelines";
import { DashboardRecentReports } from "./dashboard-recent-reports";
import { DashboardKpiCards } from "./dashboard-kpi-charts";
import { useDashboardContext } from "@/context/dashboard-context";
import { DashboardAuditorsPanel } from "./dashboard-auditors-panel";

const monthToISO = (m: string) => {
  try {
    const [y, mm] = m.split("-").map(Number);
    const from = new Date(y, mm - 1, 1);
    const to = new Date(y, mm, 0);
    return {
      fromISO: from.toISOString(),
      toISO: new Date(
        to.getFullYear(),
        to.getMonth(),
        to.getDate(),
        23,
        59,
        59,
        999
      ).toISOString(),
    };
  } catch {
    const now = new Date();
    return { fromISO: now.toISOString(), toISO: now.toISOString() };
  }
};

export const DashboardView = () => {
  const {
    refresh,
    summary,
    loadingSummary,
    panelAuditors,
    filteredTimeline,
    monthFrom,
    monthTo,
    setMonthFrom,
    setMonthTo,
    hideZeroOnTimeline,
    setHideZeroOnTimeline,
    applyPreset,
    loadingTimeline,
    recentReports,
    loadingRecent,
    loadingAuditors,
    allStandards,
    qAuditor,
    setQAuditor,
    roleFilter,
    setRoleFilter,
    stdFilter,
    setStdFilter,
    minProjects,
    setMinProjects,
    sortKey,
    setSortKey,
    sortDesc,
    setSortDesc,
    resetAuditorFilters,
  } = useDashboardContext();

  const auditorsCount = panelAuditors.length;

  return (
    <div className="mb-8">
      <DashboardHeader
        onRefresh={refresh}
        isRefreshing={
          loadingAuditors || loadingSummary || loadingTimeline || loadingRecent
        }
        lastUpdated={Date.now()}
      />

      <DashboardKpiCards
        loading={loadingSummary}
        stats={{
          totalContracts: String(summary.contracts_total ?? 0),
          expiring60d: String(summary.contracts_expiring_60d ?? 0),
          overdue: String(summary.contracts_overdue ?? 0),
          auditorsCount: String(auditorsCount ?? 0),
        }}
      />

      <DashboardStateBuckets
        loading={loadingSummary}
        hideZero={false}
        setHideZero={() => {}}
        programObj={summary.program_by_state as Record<string, number>}
        reportObj={summary.report_by_state as Record<string, number>}
      />

      <DashboardReportTimelines
        loading={loadingTimeline}
        data={filteredTimeline}
        monthFrom={monthFrom}
        monthTo={monthTo}
        setMonthFrom={setMonthFrom}
        setMonthTo={setMonthTo}
        hideZero={hideZeroOnTimeline}
        setHideZero={setHideZeroOnTimeline}
        applyPreset={applyPreset}
      />

      <DashboardRecentReports
        loading={loadingRecent}
        items={recentReports}
        fromISO={monthToISO(monthFrom).fromISO}
        toISO={monthToISO(monthTo).toISO}
      />

      <DashboardAuditorsPanel
        auditors={panelAuditors}
        loading={loadingAuditors}
        qAuditor={qAuditor}
        setQAuditor={setQAuditor}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        stdFilter={stdFilter}
        setStdFilter={setStdFilter}
        minProjects={minProjects}
        setMinProjects={setMinProjects}
        sortKey={sortKey}
        setSortKey={setSortKey}
        sortDesc={sortDesc}
        setSortDesc={setSortDesc}
        allStandards={allStandards}
        reset={() => {
          resetAuditorFilters();
        }}
      />
    </div>
  );
};
