/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
  useContext,
} from "react";
import { useAuditHistoryQuery } from "@/hooks/use-audit-history";
import { HistoryTypes } from "@/types/audit-history";

const mapApiToHistory = (item: any): HistoryTypes => {
  return {
    id: item.id,
    model: item.model,
    record_id: item.record_id,
    record_name: item.record_name,
    date: item.date,
    author: item.author,

    document_no:
      item.document_no ??
      item.doc_no ??
      item.documentNumber ??
      item.documentNo ??
      undefined,

    customer:
      item.customer ??
      item.client ??
      item.client_name ??
      item.customer_name ??
      undefined,

    standards: Array.isArray(item.standards)
      ? item.standards
      : item.standard
      ? [item.standard]
      : undefined,

    changes: (item.changes || []).map((c: any) => ({
      label: c.label,
      old: c.old,
      new: c.new,
    })),
  };
};

type Ctx = {
  data: HistoryTypes[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
  qInput: string;
  setQInput: (v: string) => void;
  page: number;
  limit: number;
  totalPages: number;
  totalCount: number;
  filteredCount: number;
  setPage: (p: number) => void;
  setLimit: (n: number) => void;
  filteredPaged: HistoryTypes[];
};

const AuditHistoryContext = createContext<Ctx | null>(null);

export const AuditHistoryProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isFetching, isError, refetch } =
    useAuditHistoryQuery({ staleTime: 5 * 60 * 1000 });

  const rows = useMemo(() => {
    const arr: any[] = data?.data ?? [];
    return arr.map(mapApiToHistory);
  }, [data]);

  const [qInput, setQInput] = useState("");

  const filteredAll = useMemo(() => {
    const q = qInput.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const blob = [
        r.record_name,
        r.model,
        r.author,
        r.changes.map((c) => `${c.label} ${c.old} ${c.new}`).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [rows, qInput]);

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
    <AuditHistoryContext.Provider value={value}>
      {children}
    </AuditHistoryContext.Provider>
  );
};

export function useAuditHistoryContext() {
  const ctx = useContext(AuditHistoryContext);
  if (!ctx)
    throw new Error(
      "useAuditHistoryContext must be used within AuditHistoryProvider"
    );
  return ctx;
}
