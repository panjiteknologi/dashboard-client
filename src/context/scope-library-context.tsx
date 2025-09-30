"use client";

import { useScopeLibraryQuery } from "@/hooks/use-scope-library";
import { useScopeListQuery } from "@/hooks/use-scope-list";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Chip = { value: string; label: string; scopeParam: string };

type ContextShape = {
  standard: string;
  setStandard: (s: string) => void;
  search: string;
  setSearch: (q: string) => void;
  page: number;
  setPage: (p: number) => void;
  limit: number;
  setLimit: (l: number) => void;
  items: string[];
  total: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  chips: Chip[];
  standards: string[];
  labelMap: Record<string, string>;
  scopeParam: string;
  isLoadingChips: boolean;
};

const ScopeLibraryContext = createContext<ContextShape | null>(null);

const toChip = (raw: { id: string; title: string }): Chip => ({
  value: raw.id,
  label: raw.title ?? raw.id,
  scopeParam: raw.id,
});

export const ScopeLibraryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [standardRaw, _setStandardRaw] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  const { data: scopeListData, isLoading: isLoadingChips } =
    useScopeListQuery();
  const chips: Chip[] = useMemo(() => {
    const arr = Array.isArray(scopeListData?.data) ? scopeListData!.data : [];
    return arr.map(toChip);
  }, [scopeListData]);

  const standards = useMemo(() => chips.map((c) => c.value), [chips]);
  const labelMap = useMemo(
    () => Object.fromEntries(chips.map((c) => [c.value, c.label])),
    [chips]
  );

  useEffect(() => {
    if (!standardRaw && chips.length > 0) _setStandardRaw(chips[0].value);
  }, [chips, standardRaw]);

  const setStandard = (s: string) => {
    _setStandardRaw(s);
    setPage(1);
  };

  const scopeParam = useMemo(
    () => chips.find((c) => c.value === standardRaw)?.scopeParam ?? "",
    [chips, standardRaw]
  );

  const { data, isLoading, error, refetch } = useScopeLibraryQuery({
    page,
    limit,
    search: debouncedSearch,
    scope: scopeParam || undefined,
  });

  const record = Array.isArray(data?.data) ? data!.data[0] : undefined;
  const items = record?.items ?? [];
  const total = typeof data?.total === "number" ? data!.total : items.length;

  const value: ContextShape = {
    standard: standardRaw,
    setStandard,
    search,
    setSearch,
    page,
    setPage,
    limit,
    setLimit,
    items,
    total,
    isLoading,
    error,
    refetch,
    chips,
    standards,
    labelMap,
    scopeParam,
    isLoadingChips,
  };

  return (
    <ScopeLibraryContext.Provider value={value}>
      {children}
    </ScopeLibraryContext.Provider>
  );
};

export const useScopeLibraryContext = () => {
  const ctx = useContext(ScopeLibraryContext);
  if (!ctx)
    throw new Error(
      "useScopeLibraryContext must be used within ScopeLibraryProvider"
    );
  return ctx;
};
