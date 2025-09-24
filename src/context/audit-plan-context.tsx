/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuditPlanQuery } from "@/hooks/use-audit-plan";
import type { PlanTypes, StandardTypes } from "@/types/projects";

function mapApiToPlan(item: any): PlanTypes {
  return {
    id: item.id,
    category: "report",
    document_no: item.name ?? item.reference ?? "-",
    reference: item.reference ?? "-",
    customer: item.partner?.name ?? "-",
    standards: item.standard?.name ? [item.standard.name] : [],
    audit_stage: item.audit_stage ?? "-",
    status: item.state === "done" ? "Done" : item.state ?? "-",
    date_start: item.date_start ?? null,
    date_end: item.date_end ?? null,
  } as PlanTypes;
}

type Ctx = {
  data: PlanTypes[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  qInput: string;
  setQInput: (v: string) => void;
  standard: string;
  setStandard: (v: string) => void;
  uniqueStandards: StandardTypes[];
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  filteredCount: number;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  filteredPaged: PlanTypes[];
};

const AuditPlanContext = createContext<Ctx | null>(null);

export function AuditPlanProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isFetching, isError, refetch } = useAuditPlanQuery({
    staleTime: 5 * 60 * 1000,
  });

  const rows = useMemo(() => {
    const arr: any[] = data?.data ?? [];
    return arr.map(mapApiToPlan).filter((x) => x.category === "report");
  }, [data]);

  const [qInput, setQInput] = useState("");
  const [standard, setStandard] = useState<string>("all");

  const uniqueStandards: StandardTypes[] = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.standards?.forEach((x) => x && s.add(x)));
    return Array?.from(s)
      .sort()
      .map((name) => ({ id: name, name })) as unknown as StandardTypes[];
  }, [rows]);

  const filteredAll = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    return rows.filter((r) => {
      const byStd = standard === "all" || r.standards?.includes(standard);
      if (!q) return byStd;
      const blob = [
        r.document_no,
        r.reference,
        r.customer,
        r.standards?.join(" "),
        r.audit_stage,
        r.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return byStd && blob.includes(q);
    });
  }, [rows, qInput, standard]);

  // pagination
  const [page, _setPage] = useState(1);
  const [limit, _setLimit] = useState<number>(20);

  const totalCount = rows.length;
  const filteredCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / Math.max(1, limit)));

  const setPage = useCallback(
    (p: number) => _setPage(Math.max(1, Math.min(p, totalPages))),
    [totalPages]
  );

  const setLimit = useCallback((n: number) => {
    _setLimit(n);
    _setPage(1);
  }, []);

  const filteredPaged = useMemo(() => {
    const start = (Math.min(page, totalPages) - 1) * limit;
    return filteredAll.slice(start, start + limit);
  }, [filteredAll, page, limit, totalPages]);

  const value: Ctx = {
    data: rows,
    isLoading,
    isFetching,
    isError,
    refetch,
    qInput,
    setQInput: (v) => {
      setQInput(v);
      _setPage(1);
    },
    standard,
    setStandard: (v) => {
      setStandard(v);
      _setPage(1);
    },
    uniqueStandards,
    page,
    limit,
    totalPages,
    totalCount,
    filteredCount,
    setPage,
    setLimit,
    filteredPaged,
  };

  return (
    <AuditPlanContext.Provider value={value}>
      {children}
    </AuditPlanContext.Provider>
  );
}

export function useAuditPlanContext() {
  const ctx = useContext(AuditPlanContext);
  if (!ctx)
    throw new Error(
      "useAuditPlanContext must be used within AuditPlanProvider"
    );
  return ctx;
}
