import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuditorsQuery } from "@/hooks/use-auditors";

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

type Meta = { key: string; limit: number; offset: number };

type AuditorsCtx = {
  auditors: AuditorLite[];
  meta?: Meta;
  filtered: AuditorLite[];
  totalCount: number;
  filteredCount: number;
  allRoles: string[];
  allIsos: string[];
  qInput: string;
  role: string;
  iso: string;
  page: number;
  totalPages: number;
  limit: number;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  offset: number;
  setQInput: (v: string) => void;
  setRole: (v: string) => void;
  setIso: (v: string) => void;
  nextPage: () => void;
  prevPage: () => void;
  reset: () => void;
  refresh: () => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
};

const AuditorsContext = createContext<AuditorsCtx | null>(null);

export function AuditorsProvider({ children }: { children: ReactNode }) {
  const { data, isLoading, isFetching, isError, refetch } = useAuditorsQuery({
    staleTime: 5 * 60 * 1000,
  });

  const auditors: AuditorLite[] = useMemo(() => {
    const arr = (data?.data ?? []) as AuditorLite[];
    return Array.isArray(arr) ? arr : [];
  }, [data]);

  const meta: Meta | undefined = data?.meta;

  const [qInput, setQInput] = useState("");
  const [role, setRole] = useState<string>("all");
  const [iso, setIso] = useState<string>("all");

  const [limit, _setLimit] = useState<number>(meta?.limit ?? 10);
  const [offset, setOffset] = useState<number>(meta?.offset ?? 0);

  const filteredAll = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    return auditors.filter((a) => {
      const byQ =
        !q ||
        a.name.toLowerCase().includes(q) ||
        (a.job_title ?? "").toLowerCase().includes(q);
      const byRole = role === "all" || a.roles?.includes(role);
      const byIso = iso === "all" || a.iso_standards?.includes(iso);
      return byQ && byRole && byIso;
    });
  }, [auditors, qInput, role, iso]);

  const totalCount = auditors.length;
  const filteredCount = filteredAll.length;

  const page = Math.floor(offset / Math.max(1, limit)) + 1;
  const totalPages = Math.max(1, Math.ceil(filteredCount / Math.max(1, limit)));

  const filtered = useMemo(() => {
    const start = Math.min(offset, Math.max(0, (totalPages - 1) * limit));
    const end = start + limit;
    return filteredAll.slice(start, end);
  }, [filteredAll, offset, limit, totalPages]);

  const allRoles = useMemo(() => {
    const s = new Set<string>();
    auditors.forEach((a) => a.roles?.forEach((r) => s.add(r)));
    return ["all", ...Array.from(s).sort()];
  }, [auditors]);

  const allIsos = useMemo(() => {
    const s = new Set<string>();
    auditors.forEach((a) => a.iso_standards?.forEach((x) => s.add(x)));
    return ["all", ...Array.from(s).sort()];
  }, [auditors]);

  const setPage = useCallback(
    (p: number) => {
      const clamped = Math.max(1, Math.min(p, totalPages || 1));
      setOffset((clamped - 1) * Math.max(1, limit));
    },
    [limit, totalPages]
  );

  const setLimit = useCallback((n: number) => {
    _setLimit(n);
    setOffset(0);
  }, []);

  const nextPage = useCallback(() => setPage(page + 1), [page, setPage]);
  const prevPage = useCallback(() => setPage(page - 1), [page, setPage]);

  const reset = useCallback(() => {
    setQInput("");
    setRole("all");
    setIso("all");
    _setLimit(meta?.limit ?? 10);
    setOffset(0);
  }, [meta?.limit]);

  const refresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const value: AuditorsCtx = {
    auditors,
    meta,
    filtered,
    totalCount,
    filteredCount,
    allRoles,
    allIsos,
    qInput,
    role,
    iso,
    page,
    totalPages,
    limit,
    setPage,
    setLimit,
    offset,
    setQInput,
    setRole,
    setIso,
    nextPage,
    prevPage,
    reset,
    refresh,
    isLoading,
    isFetching,
    isError,
  };

  return (
    <AuditorsContext.Provider value={value}>
      {children}
    </AuditorsContext.Provider>
  );
}

export function useAuditorsContext() {
  const ctx = useContext(AuditorsContext);
  if (!ctx)
    throw new Error("useAuditorsContext must be used within AuditorsProvider");
  return ctx;
}
