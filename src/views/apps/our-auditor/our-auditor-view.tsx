"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  ClipboardList,
  Filter,
  Search,
  UserCircle2,
} from "lucide-react";
import { AllOurAuditor, OurAuditor } from "@/types/our-auditor";
import { OurAuditorCard } from "./our-auditor-card";
import { cx } from "@/utils";
import { THEME } from "@/constant";

export function OurAuditorView({ data }: { data: AllOurAuditor }) {
  const auditors: OurAuditor[] = useMemo(() => {
    const arr = data?.data?.auditors;
    return Array.isArray(arr) ? arr : [];
  }, [data]);

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
          Our Auditor
        </h1>
        <p className={cx("text-sm", THEME.subText)}>
          Order &amp; invoice overview synced to your data
        </p>
      </div>

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

      <div className="space-y-4">
        {filtered.map((aud, index) => (
          <OurAuditorCard key={index} auditor={aud} />
        ))}

        {filtered.length === 0 && (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
            Tidak ada data auditor yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
