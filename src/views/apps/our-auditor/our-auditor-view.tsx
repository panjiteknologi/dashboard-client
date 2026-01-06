"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  ClipboardList,
  Filter,
  Search,
  UserCircle2,
} from "lucide-react";
import { AllOurAuditor, OurAuditor, OurAuditorProject } from "@/types/our-auditor";
import { OurAuditorCard } from "./our-auditor-card";
import { cx } from "@/utils";
import { THEME } from "@/constant";
import { OurAuditorCardSkeleton } from "./our-auditor-card-skeleton";

// Type for raw API response
interface RawAuditorData {
  id?: number;
  sales_person?: string;
  auditor_name?: string;
  customer?: string;
  customer_name?: string;
  document_no?: string;
  aplication_form?: string;
  iso_standards?: string[];
  audit_stage?: string;
  tahapan?: string;
  audit_date?: string;
  certification_type?: string;
  audit_method?: string;
  scope?: string;
  state?: string;
  audit_start?: string;
  audit_end?: string;
  contact_person?: string;
  auditor_role?: string;
  [key: string]: unknown; // Allow additional properties
}

const Shimmer = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-md bg-slate-200",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent animate-[shimmer_1.6s_linear_infinite]" />
    </div>
  );
};

const StatCardSkeleton = () => {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <Shimmer className="h-3 w-24" />
      <div className="mt-2 flex items-center gap-2">
        <Shimmer className="h-5 w-5 rounded-full" />
        <Shimmer className="h-6 w-16" />
      </div>
    </div>
  );
};

const FilterBarSkeleton = () => {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-lg">
        <Shimmer className="h-9 w-full rounded-xl" />
      </div>
      <div className="flex items-center gap-2">
        <Shimmer className="h-9 w-36 rounded-xl" />
      </div>
    </div>
  );
};

export const OurAuditorView = ({
  data,
  loading,
  skeletonCount = 4,
  skeletonProjectRows = 2,
}: {
  data: AllOurAuditor;
  loading?: boolean;
  skeletonCount?: number;
  skeletonProjectRows?: number;
}) => {
  const auditors: OurAuditor[] = useMemo(() => {
    // Handle different data structures
    let arr: OurAuditor[] = [];

    // Structure 1: { data: { auditors: [...] } }
    if (data?.data?.auditors && Array.isArray(data.data.auditors)) {
      arr = data.data.auditors;
    }
    // Structure 2: Direct array
    else if (Array.isArray(data)) {
      arr = data;
    }
    // Structure 3: { data: [...] }
    else if (data?.data && Array.isArray(data.data)) {
      // If data.data contains projects/customers directly, convert to auditor format
      arr = data.data.map((item: unknown, index: number) => {
        const rawItem = item as RawAuditorData;
        return {
          id: rawItem.id || index,
          name: rawItem.sales_person || rawItem.auditor_name || `Auditor ${index + 1}`,
          projects: [{
            plan_id: rawItem.id || 0,
            document_no: rawItem.document_no || rawItem.aplication_form || '',
            customer_name: rawItem.customer || rawItem.customer_name || '',
            iso_standards: rawItem.iso_standards || [],
            audit_stage: rawItem.audit_stage || rawItem.tahapan || '',
            audit_date: rawItem.audit_date,
            certification_type: rawItem.certification_type,
            audit_method: rawItem.audit_method,
            scope: rawItem.scope,
            state: rawItem.state,
            audit_start: rawItem.audit_start,
            audit_end: rawItem.audit_end,
            contact_person: rawItem.contact_person,
            auditor_role: rawItem.auditor_role,
          }],
        };
      });
    }

    return arr;
  }, [data]);

  // Simplified loading logic - only use the loading prop
  const isLoading = loading ?? false;

  const [query, setQuery] = useState("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const allStages = useMemo(() => {
    const s = new Set<string>();
    auditors.forEach((a) =>
      a.projects?.forEach((p) => p.audit_stage && s.add(p.audit_stage))
    );
    return ["all", ...Array.from(s)];
  }, [auditors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditors
      .map((aud) => {
        const projects = (aud.projects ?? []).filter((p) => {
          const stageOk =
            stageFilter === "all" || p.audit_stage === stageFilter;
          if (!stageOk) return false;

          if (!q) return true;
          const hay = [
            aud.name,
            p.document_no,
            p.customer_name,
            ...(p.iso_standards ?? []),
            p.audit_stage,
            p.audit_method,
            p.certification_type,
            p.contact_person,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();
          return hay.includes(q);
        });

        return { ...aud, projects };
      })
      .filter((a) => a.projects.length > 0 || q === "");
  }, [auditors, query, stageFilter]);

  const stats = useMemo(() => {
    let totalProjects = 0;
    let done = 0;
    filtered.forEach((a) =>
      a.projects.forEach((p) => {
        totalProjects += 1;
        if (p.state === "done") done += 1;
      })
    );
    return {
      auditors: filtered.length,
      projects: totalProjects,
      completed: done,
    };
  }, [filtered]);

  return (
    <div className="space-y-4">
      <div>
        <h1
          className={cx(
            "text-xl font-bold leading-tight tracking-tight",
            THEME.headerText
          )}
        >
          History Audit
        </h1>
        <p className={cx("text-sm", THEME.subText)}>
          Order &amp; invoice overview synced to your data
        </p>
      </div>

      {isLoading ? (
        <div className="grid gap-3 md:grid-cols-3">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">Auditors</div>
            <div className="mt-1 flex items-center gap-2">
              <UserCircle2 className="h-5 w-5 text-slate-600" />
              <div className="text-xl font-semibold text-slate-900">
                {stats?.auditors}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">Total Projects</div>
            <div className="mt-1 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-slate-600" />
              <div className="text-xl font-semibold text-slate-900">
                {stats?.projects}
              </div>
            </div>
          </div>
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="text-xs text-slate-500">Completed</div>
            <div className="mt-1 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-slate-600" />
              <div className="text-xl font-semibold text-slate-900">
                {stats?.completed}
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <FilterBarSkeleton />
      ) : (
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-lg">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none ring-sky-300 focus:ring-2"
              placeholder="Cari auditor, dokumen, customer, ISO…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <select
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-sky-300 focus:ring-2"
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
            >
              {allStages?.map((s, index) => (
                <option key={index} value={s}>
                  {s === "all" ? "All stages" : s}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: skeletonCount }).map((_, i) => (
            <OurAuditorCardSkeleton key={i} projectRows={skeletonProjectRows} />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((aud, index) => (
            <OurAuditorCard key={index} auditor={aud} />
          ))
        ) : (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
            Tidak ada data auditor yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
};
