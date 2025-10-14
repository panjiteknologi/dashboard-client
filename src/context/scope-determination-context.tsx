"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { useScopeListQuery } from "@/hooks/use-scope-list";
import { useScopeLibraryQuery } from "@/hooks/use-scope-library";
import { useDebounce } from "@/hooks/use-debounce";
import { useScopeDetermination } from "@/hooks/use-scope-determination";
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
  const header = ["#", "Code", "Label", "Title"].join(",");
  const body = rows
    .map((r) =>
      [
        r.idx,
        r.code ?? "",
        `"${r.label.replace(/"/g, '""')}"`,
        `"${r.title?.replace(/"/g, '""') ?? ""}"`,
      ].join(",")
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

// ✅ Kembalikan items beserta scope title-nya
function getItemsFromLibResp(resp: unknown): { label: string; title: string }[] {
  if (isRecord(resp)) {
    const data = resp.data;
    if (Array.isArray(data)) {
      // Ambil semua items dan sertakan title scope-nya
      const allItems = data.flatMap((scopeItem) => {
        if (isRecord(scopeItem) && Array.isArray(scopeItem.items)) {
          const title = typeof scopeItem.title === "string" ? scopeItem.title : "Unknown Scope";
          return scopeItem.items
            .filter((x): x is string => typeof x === "string")
            .map((label) => ({ label, title }));
        }
        return [];
      });
      return allItems;
    }

    if (Array.isArray(resp.items)) {
      return resp.items
        .filter((x): x is string => typeof x === "string")
        .map((label) => ({ label, title: "Unknown Scope" }));
    }
  }

  if (Array.isArray(resp) && resp.every((x) => typeof x === "string")) {
    return (resp as string[]).map((label) => ({ label, title: "Unknown Scope" }));
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
  const [selectedLang, setSelectedLang] = useState<'IDN' | 'EN'>('IDN');
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Quick search keywords
  const quickIDN = ["pertanian", "kehutanan", "perikanan", "konstruksi", "logam", "teknologi informasi", "keuangan", "beton", "kelistrikan"] as const;
  const quickEN = ["agriculture", "forestry", "fisheries", "construction", "metal", "information technology", "finance", "concrete", "electrical"] as const;

  // Dynamic quick based on selected language
  const quick = selectedLang === 'IDN' ? quickIDN : quickEN;

  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  const { data: listResp, isLoading: isLoadingChips } = useScopeListQuery();

  // AI Scope Determination
  const {
    response: aiResponse,
    isLoading: isLoadingAI,
    error: aiError,
    determinateScope: determinateScopeHook,
    reset: resetAI
  } = useScopeDetermination();

  // Wrapper function to pass selectedLang
  const determinateScope = useCallback(async (query: string) => {
    await determinateScopeHook(query, selectedLang);
  }, [selectedLang, determinateScopeHook]);

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
  const shouldQuery = debounced.trim().length > 0;

  // Comment: Disable auto query saat typing, hanya aktif manual via Enter/button
  const { data: libResp, isLoading: isLoadingList } = useScopeLibraryQuery(
    {
      page,
      limit: pageSize,
      search: shouldQuery ? debounced : "",
      scope: scopeId || undefined,
    },
    { enabled: false } // ✅ Disabled auto query
  );

  // ✅ Ambil semua item + title scope-nya, lalu filter sesuai pencarian
  const items = useMemo(() => {
    const allItems = getItemsFromLibResp(libResp);

    if (debounced.trim()) {
      return allItems.filter((item) =>
        item.label.toLowerCase().includes(debounced.toLowerCase())
      );
    }

    return allItems;
  }, [libResp, debounced]);

  // ✅ Masukkan title ke dalam rows
  const rows: ScopeROW[] = useMemo(
    () =>
      items.map((item, i) => ({
        idx: (page - 1) * pageSize + i + 1,
        code: extractCode(item.label),
        label: item.label,
        title: item.title,
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

    // Stopwords to filter out (Indonesian & English) - sync with backend
    const stopwords = [
      // Indonesian stopwords
      'yang', 'dan', 'atau', 'adalah', 'untuk', 'dari', 'di', 'ke', 'pada',
      'dengan', 'ini', 'itu', 'saya', 'bergerak', 'menggunakan', 'bahan',
      'membuat', 'melakukan', 'perusahaan',
      // English stopwords
      'the', 'a', 'an', 'and', 'or', 'for', 'of', 'in', 'to', 'on', 'with',
      'this', 'that', 'using', 'by', 'as', 'at', 'be', 'we', 'our', 'my',
      'create', 'make', 'do', 'have', 'has', 'company', 'business'
    ];

    // Split query into words and filter
    const keywords = q
      .toLowerCase()
      .split(/\s+/)
      .filter(word =>
        word.length >= 3 && // Min 3 characters
        !stopwords.includes(word) // Not a stopword
      );

    // If no valid keywords, fallback to original query
    if (keywords.length === 0) {
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
    }

    // Create regex pattern for all keywords (e.g., "produksi|rambut|palsu|plastik")
    const pattern = keywords.map(escapeRegex).join('|');
    const parts = text.split(new RegExp(`(${pattern})`, "ig"));

    return parts.map((p, i) => {
      const isMatch = keywords.some(kw => p.toLowerCase() === kw.toLowerCase());
      return isMatch ? (
        <mark
          key={i}
          className="rounded px-0.5 bg-yellow-200/60 dark:bg-yellow-600/40"
        >
          {p}
        </mark>
      ) : (
        <span key={i}>{p}</span>
      );
    });
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
    // AI Scope Determination
    aiResponse,
    isLoadingAI,
    aiError,
    determinateScope,
    resetAI,
    // Language Selection
    selectedLang,
    setSelectedLang,
  };

  useEffect(() => {
    setPage(1);
  }, [debounced]);

  useEffect(() => {
    // Reset AI response when language changes
    if (aiResponse) {
      resetAI();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLang]);

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
