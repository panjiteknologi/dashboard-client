"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useScopeListQuery } from "@/hooks/use-scope-list";
import { useScopeLibraryQuery } from "@/hooks/use-scope-library";
import { useDebounce } from "@/hooks/use-debounce";
import { ScopeCTX, ScopeItem, ScopeROW } from "@/types/scope";

const ScopeSearchContext = createContext<ScopeCTX | null>(null);

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

function asArray<T = unknown>(val: unknown): T[] {
  if (Array.isArray(val)) return val as T[];
  if (isRecord(val)) {
    for (const k of ["data", "items", "results", "list"] as const) {
      const v = val[k];
      if (Array.isArray(v)) return v as T[];
    }
  }
  return [];
}

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const extractCode = (label: string): string | null => {
  const m = label.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : null;
};

const rowsToCsv = (rows: ScopeROW[]) => {
  const header = ["#", "Code", "Label"].join(",");
  const body = rows
    .map((r) =>
      [r.idx, r.code ?? "", `"${r.label.replace(/"/g, '""')}"`].join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
};

const exportCsvImpl = (rows: ScopeROW[]) => {
  const csv = rowsToCsv(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "scope-sectors.csv";
  a.click();
  URL.revokeObjectURL(url);
};

function getItemsFromLibResp(resp: unknown): string[] {
  if (isRecord(resp)) {
    const data = resp.data;
    if (Array.isArray(data)) {
      const first = data[0];
      if (isRecord(first) && Array.isArray(first.items)) {
        return first.items.filter((x): x is string => typeof x === "string");
      }
    }
    if (Array.isArray(resp.items)) {
      return resp.items.filter((x): x is string => typeof x === "string");
    }
  }
  if (Array.isArray(resp) && resp.every((x) => typeof x === "string")) {
    return resp as string[];
  }
  return [];
}

export const ScopeSearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [query, setQuery] = useState<string>("");
  const debounced = useDebounce(query, 250);
  const [showCodes, setShowCodes] = useState<boolean>(true);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const quick = ["pertanian", "konstruksi", "logam", "IT", "keuangan"] as const;

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const { data: listResp, isLoading: isLoadingChips } = useScopeListQuery();

  const rawList = useMemo<unknown[]>(
    () =>
      asArray(
        listResp && isRecord(listResp)
          ? (listResp as Record<string, unknown>).data ?? listResp
          : listResp
      ),
    [listResp]
  );

  const scopes: ScopeItem[] = useMemo(() => {
    return rawList
      .map((x): ScopeItem | null => {
        if (typeof x === "string") {
          return { id: x, title: x };
        }
        if (isRecord(x)) {
          const idRaw =
            (x.id as unknown) ??
            (x._id as unknown) ??
            (x.value as unknown) ??
            (x.slug as unknown);
          const titleRaw =
            (x.title as unknown) ??
            (x.name as unknown) ??
            (x.label as unknown) ??
            idRaw;

          const id =
            typeof idRaw === "string" || typeof idRaw === "number"
              ? String(idRaw)
              : null;
          const title =
            typeof titleRaw === "string" || typeof titleRaw === "number"
              ? String(titleRaw)
              : null;

          return id ? { id, title: title ?? "Untitled" } : null;
        }
        return null;
      })
      .filter((s): s is ScopeItem => !!s?.id);
  }, [rawList]);

  const [scopeId, setScopeId] = useState<string>("");

  const labelMap = useMemo<Record<string, string>>(
    () => Object.fromEntries(scopes.map((x) => [x.id, x.title])),
    [scopes]
  );

  const scopeLabel = labelMap[scopeId] ?? "Pilih Standar";

  const shouldQuery = !!scopeId && debounced.trim().length > 0;

  const { data: libResp, isLoading: isLoadingList } = useScopeLibraryQuery(
    {
      page,
      limit: pageSize,
      search: shouldQuery ? debounced : "",
      scope: shouldQuery ? scopeId : undefined,
    },
    {
      enabled: shouldQuery,
      keepPreviousData: true,
    } as { enabled: boolean; keepPreviousData: boolean }
  );

  const items: string[] = useMemo(
    () => getItemsFromLibResp(libResp),
    [libResp]
  );

  const rows: ScopeROW[] = useMemo(
    () =>
      items.map((label, i) => ({
        idx: (page - 1) * pageSize + i + 1,
        code: extractCode(label),
        label,
      })),
    [items, page]
  );

  const total: number = shouldQuery
    ? isRecord(libResp) && typeof libResp.total === "number"
      ? libResp.total
      : rows.length
    : 0;

  const totalPages = shouldQuery ? Math.max(1, Math.ceil(total / pageSize)) : 1;

  const highlight = (text: string, q: string) => {
    if (!q) return text;
    const parts = text.split(new RegExp(`(${escapeRegex(q)})`, "ig"));
    return parts.map((p, i) =>
      p.toLowerCase() === q.toLowerCase() ? (
        <mark
          key={i}
          className="rounded px-0.5 bg-yellow-200/60 dark:bg-yellow-600/40"
        >
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      )
    );
  };

  const value: ScopeCTX = {
    query,
    setQuery,
    debounced,
    searchRef,
    quick: [...quick],
    showCodes,
    setShowCodes,
    scopes,
    scopeId,
    setScopeId,
    scopeLabel,
    isLoadingChips,
    isLoadingList,
    shouldQuery,
    rows,
    total,
    totalPages,
    page,
    setPage,
    pageSize,
    highlight,
    exportCsv: exportCsvImpl,
  };

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    if (!scopeId && scopes.length > 0) setScopeId(scopes[0].id);
  }, [scopeId, scopes]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ScopeSearchContext.Provider value={value}>
      {children}
    </ScopeSearchContext.Provider>
  );
};

export const useScopeDeterminationContext = () => {
  const ctx = useContext(ScopeSearchContext);
  if (!ctx) {
    throw new Error(
      "useScopeDeterminationContext must be used within <ScopeSearchProvider>"
    );
  }
  return ctx;
};
