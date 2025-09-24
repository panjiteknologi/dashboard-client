/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAuditorsQuery } from "@/hooks/use-auditors";
import { useSummaryQuery } from "@/hooks/use-summary";
import { useRecentReportsQuery } from "@/hooks/use-recent-reports";

function nnum(n: any, def = 0) {
  const v = Number(n);
  return Number.isFinite(v) ? v : def;
}

export type AuditorLite = {
  id: number;
  name: string;
  job_title: string | null;
  work_email: string | null;
  work_phone: string | null;
  mobile: string | null;
  roles: string[];
  projects_count: number;
  last_audit_start: string | null;
  last_audit_end: string | null;
  iso_standards: string[];
};

export type PanelAuditor = {
  id: number | string;
  name: string;
  role: string;
  standards: string[];
  projectsCount: number;
  lastAuditDate?: string;
};

type SortKey = "name" | "projects" | "last_audit";

function extractSummary(raw: any) {
  const root = raw?.data ?? raw ?? {};
  const s = root?.summary ?? root;

  return {
    program_by_state: s?.program_by_state ?? {},
    report_by_state: s?.report_by_state ?? {},
    tsi_iso_by_state: s?.tsi_iso_by_state ?? {},
    tsi_ispo_by_state: s?.tsi_ispo_by_state ?? {},
    contracts_total: nnum(root?.contracts_total ?? s?.contracts_total, 0),
    contracts_expiring_60d: nnum(
      root?.contracts_expiring_60d ?? s?.contracts_expiring_60d,
      0
    ),
    contracts_overdue: nnum(root?.contracts_overdue ?? s?.contracts_overdue, 0),
    tables: root?.tables ?? s?.tables ?? {},
    meta: root?.meta ?? {},
  };
}

const clampMonth = (m: string) =>
  /^\d{4}-\d{2}$/.test(m) ? m : new Date().toISOString().slice(0, 7);

export type TimelinePoint = {
  month: string; // "YYYY-MM"
  buckets: Record<string, number>;
  total: number;
};

type DashboardContextValue = {
  // data normalized
  summary: ReturnType<typeof extractSummary>;
  panelAuditors: PanelAuditor[];
  allStandards: string[];
  timeline: TimelinePoint[];
  filteredTimeline: TimelinePoint[];
  recentReports: any[];

  // filters (auditors)
  qAuditor: string;
  setQAuditor: (v: string) => void;
  roleFilter: "all" | "lead_auditor" | "auditor_1" | "auditor_2";
  setRoleFilter: (v: any) => void;
  stdFilter: string;
  setStdFilter: (v: string) => void;
  minProjects: number;
  setMinProjects: (v: number) => void;
  sortKey: SortKey;
  setSortKey: (v: SortKey) => void;
  sortDesc: boolean;
  setSortDesc: (v: boolean) => void;
  resetAuditorFilters: () => void;

  // timeline
  monthFrom: string;
  setMonthFrom: (v: string) => void;
  monthTo: string;
  setMonthTo: (v: string) => void;
  applyPreset: (p: "ytd" | "last30" | "last90" | "full") => void;
  hideZeroOnTimeline: boolean;
  setHideZeroOnTimeline: (v: boolean) => void;

  // loading / error / refresh
  loadingAuditors: boolean;
  loadingSummary: boolean;
  loadingTimeline: boolean;
  loadingRecent: boolean;
  isRefreshingAny: boolean;
  errorAuditors?: string;
  errorSummary?: string;
  errorTimeline?: string;
  errorRecent?: string;
  refresh: () => void;

  lastUpdated: number;
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    data: auditorsResp,
    isLoading: loadingAud,
    isFetching: fetchingAud,
    isError: isErrAud,
    error: errAud,
    refetch: refetchAud,
  } = useAuditorsQuery({ staleTime: 5 * 60 * 1000 });

  const {
    data: summaryResp,
    isLoading: loadingSum,
    isFetching: fetchingSum,
    isError: isErrSum,
    error: errSum,
    refetch: refetchSum,
  } = useSummaryQuery({ staleTime: 5 * 60 * 1000 });

  const {
    data: timelineResp,
    isLoading: loadingTime,
    isFetching: fetchingTime,
    isError: isErrTime,
    error: errTime,
    refetch: refetchTime,
  } = useRecentReportsQuery({ page: 1, limit: 10, enabled: true });

  const {
    data: recentResp,
    isLoading: loadingRec,
    isFetching: fetchingRec,
    isError: isErrRec,
    error: errRec,
    refetch: refetchRec,
  } = useRecentReportsQuery({ page: 1, limit: 10, enabled: true });

  // ===== Summary
  const summary = useMemo(() => {
    try {
      return extractSummary(summaryResp);
    } catch {
      return extractSummary({});
    }
  }, [summaryResp]);

  // ===== Auditors
  const auditorsLite: AuditorLite[] = useMemo(() => {
    const arr = (auditorsResp?.data ?? []) as AuditorLite[];
    return Array.isArray(arr) ? arr : [];
  }, [auditorsResp]);

  const panelAuditors: PanelAuditor[] = useMemo(
    () =>
      (auditorsLite || []).map((a) => ({
        id: a?.id ?? crypto.randomUUID?.() ?? Math.random(),
        name: a?.name ?? "—",
        role: a?.roles?.[0] ?? "",
        standards: a?.iso_standards ?? [],
        projectsCount: nnum(a?.projects_count, 0),
        lastAuditDate: a?.last_audit_end ?? a?.last_audit_start ?? undefined,
      })),
    [auditorsLite]
  );

  const allStandards = useMemo(() => {
    const s = new Set<string>();
    (auditorsLite || []).forEach((a) =>
      a?.iso_standards?.forEach((x) => x && s.add(x))
    );
    return ["all", ...Array.from(s).sort()];
  }, [auditorsLite]);

  // ===== Filters
  const [qAuditor, setQAuditor] = useState("");
  const [roleFilter, setRoleFilter] = useState<
    "all" | "lead_auditor" | "auditor_1" | "auditor_2"
  >("all");
  const [stdFilter, setStdFilter] = useState<string>("all");
  const [minProjects, setMinProjects] = useState<number>(0);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDesc, setSortDesc] = useState<boolean>(false);

  const resetAuditorFilters = useCallback(() => {
    setQAuditor("");
    setRoleFilter("all");
    setStdFilter("all");
    setMinProjects(0);
    setSortKey("name");
    setSortDesc(false);
  }, []);

  // ===== Timeline
  const [monthFrom, setMonthFrom] = useState<string>(
    clampMonth(
      new Date(new Date().setMonth(new Date().getMonth() - 5))
        .toISOString()
        .slice(0, 7)
    )
  );
  const [monthTo, setMonthTo] = useState<string>(
    clampMonth(new Date().toISOString().slice(0, 7))
  );

  const applyPreset = useCallback((p: "ytd" | "last30" | "last90" | "full") => {
    const now = new Date();
    if (p === "ytd") {
      setMonthFrom(`${now.getFullYear()}-01`);
      setMonthTo(now.toISOString().slice(0, 7));
    } else if (p === "last30" || p === "last90") {
      const mBack = p === "last30" ? 1 : 3;
      const d = new Date(now);
      d.setMonth(now.getMonth() - mBack);
      setMonthFrom(d.toISOString().slice(0, 7));
      setMonthTo(now.toISOString().slice(0, 7));
    } else {
      setMonthFrom("2000-01");
      setMonthTo(now.toISOString().slice(0, 7));
    }
  }, []);

  const [hideZeroOnTimeline, setHideZeroOnTimeline] = useState(false);

  const timelineRaw: any[] = useMemo(() => {
    const r = (timelineResp as any)?.data ?? timelineResp ?? [];
    return Array.isArray(r) ? r : [];
  }, [timelineResp]);

  const timeline: TimelinePoint[] = useMemo(() => {
    try {
      return (timelineRaw || []).map((row: any) => {
        const month = clampMonth(row?.month ?? row?.m ?? "");
        const buckets = row?.buckets ?? {
          ...(typeof row?.new === "number" ? { new: row.new } : {}),
          ...(typeof row?.confirm === "number" ? { confirm: row.confirm } : {}),
          ...(typeof row?.done === "number" ? { done: row.done } : {}),
          ...(row?.other_buckets && typeof row.other_buckets === "object"
            ? row.other_buckets
            : {}),
        };
        const total = Object.values(buckets).reduce(
          (acc: number, v: any) => acc + (Number(v) || 0),
          0
        );
        return { month, buckets, total };
      });
    } catch {
      return [];
    }
  }, [timelineRaw]);

  const filteredTimeline: TimelinePoint[] = useMemo(() => {
    const from = clampMonth(monthFrom);
    const to = clampMonth(monthTo);
    const inRange = (m: string) => m >= from && m <= to;

    const arr = (timeline || [])
      .filter((p) => p?.month && inRange(p.month))
      .map((p) => {
        if (!hideZeroOnTimeline) return p;
        const filteredBuckets = Object.fromEntries(
          Object.entries(p.buckets || {}).filter(([, v]) => Number(v) > 0)
        );
        const total = Object.values(filteredBuckets).reduce(
          (acc: number, v: any) => acc + (Number(v) || 0),
          0
        );
        return { ...p, buckets: filteredBuckets, total };
      })
      .sort((a, b) => (a.month < b.month ? -1 : 1));

    return arr;
  }, [timeline, monthFrom, monthTo, hideZeroOnTimeline]);

  // ===== Recent Reports
  const recentReports: any[] = useMemo(() => {
    const hookData = (recentResp as any)?.data ?? recentResp ?? [];
    const base =
      (Array.isArray(hookData) ? hookData : null) ??
      summary.tables?.recent_reports ??
      [];
    const arr = Array.isArray(base) ? base : [];

    return arr.map((r: any, i: number) => ({
      id: r?.id ?? r?.report_id ?? i,
      title: r?.title ?? r?.report_title ?? r?.project_name ?? "Report",
      company: r?.company ?? r?.client ?? r?.customer ?? "-",
      state: r?.state ?? r?.status ?? "-",
      created_at: r?.created_at ?? r?.date ?? r?.issued_at ?? null,
      ...r,
    }));
  }, [recentResp, summary.tables]);

  // ===== Flags & Error strings
  const loadingAuditors = loadingAud || fetchingAud;
  const loadingSummary = loadingSum || fetchingSum;
  const loadingTimeline = loadingTime || fetchingTime;
  const loadingRecent = loadingRec || fetchingRec;
  const isRefreshingAny =
    loadingAuditors || loadingSummary || loadingTimeline || loadingRecent;

  const errorAuditors = isErrAud
    ? (errAud as any)?.message ?? "Gagal memuat auditors."
    : undefined;
  const errorSummary = isErrSum
    ? (errSum as any)?.message ?? "Gagal memuat ringkasan."
    : undefined;
  const errorTimeline = isErrTime
    ? (errTime as any)?.message ?? "Gagal memuat timeline laporan."
    : undefined;
  const errorRecent = isErrRec
    ? (errRec as any)?.message ?? "Gagal memuat recent reports."
    : undefined;

  const refresh = useCallback(() => {
    refetchAud();
    refetchSum();
    refetchTime();
    refetchRec();
  }, [refetchAud, refetchSum, refetchTime, refetchRec]);

  const value: DashboardContextValue = {
    summary,
    panelAuditors,
    allStandards,
    timeline,
    filteredTimeline,
    recentReports,

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

    monthFrom,
    setMonthFrom,
    monthTo,
    setMonthTo,
    applyPreset,
    hideZeroOnTimeline,
    setHideZeroOnTimeline,

    loadingAuditors,
    loadingSummary,
    loadingTimeline,
    loadingRecent,
    isRefreshingAny,
    errorAuditors,
    errorSummary,
    errorTimeline,
    errorRecent,
    refresh,

    lastUpdated: Date.now(),
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx)
    throw new Error(
      "useDashboardContext must be used within <DashboardProvider>"
    );
  return ctx;
};
