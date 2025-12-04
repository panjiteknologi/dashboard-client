"use client";

import { CRMContextType, DataCRMType, StageValue } from "@/types/crm";
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";

export function CRMProvider({
  data,
  onResetPage,
  debounceMs = 300,
  children,
}: {
  data: DataCRMType[];
  onResetPage?: () => void;
  debounceMs?: number;
  children: React.ReactNode;
}) {
  const [qInput, setQInput] = useState("");
  const q = useDebouncedValue(qInput, debounceMs);

  const [stage, setStage] = useState<StageValue>("all");
  const [iso, setIso] = useState<string>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stageTmp, setStageTmp] = useState<StageValue>("all");
  const [isoTmp, setIsoTmp] = useState<string>("all");

  useEffect(() => {
    if (drawerOpen) {
      setStageTmp(stage);
      setIsoTmp(iso);
    }
  }, [drawerOpen, stage, iso]);

  // ISO OPTIONS dari data CRM
  const isoOptions = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach((c) =>
      (c.iso_standards ?? []).forEach((i) => i?.name && s.add(i.name))
    );
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    const qlc = q.toLowerCase();

    return (data ?? []).filter((raw) => {
      const partnerName = raw.partner_name ?? "";
      const contractNumber = raw.contract_number ?? "";
      const tahapanAudit = raw.tahapan_audit ?? "";
      const sales = raw.sales_person ?? "";
      const level = raw.level ?? "";

      const isoStandardNames: string[] = Array.isArray(raw.iso_standards)
        ? raw.iso_standards.map((s) => s?.name ?? "").filter(Boolean)
        : [];

      const searchText = (
        partnerName +
        " " +
        contractNumber +
        " " +
        tahapanAudit +
        " " +
        sales +
        " " +
        level +
        " " +
        isoStandardNames.join(" ")
      ).toLowerCase();

      const queryHit = !q || searchText.includes(qlc);

      const tahapanLc = (tahapanAudit || "").toLowerCase();

      const stageHit =
        stage === "all" ||
        (stage === "s1" &&
          (tahapanLc.includes("1") || tahapanLc.includes("i"))) ||
        (stage === "s2" &&
          (tahapanLc.includes("2") || tahapanLc.includes("ii")));

      const isoHit =
        iso === "all" || isoStandardNames.some((std) => std === iso);

      return queryHit && stageHit && isoHit;
    });
  }, [data, q, stage, iso]);

  const hasActiveFilters = stage !== "all" || iso !== "all";

  const setStageSafe = (v: StageValue) => {
    setStage(v);
    onResetPage?.();
  };

  const setIsoSafe = (v: string) => {
    setIso(v);
    onResetPage?.();
  };

  const clearAll = () => {
    setStage("all");
    setIso("all");
    onResetPage?.();
  };

  const applyDrawer = () => {
    setStageSafe(stageTmp);
    setIsoSafe(isoTmp);
    setDrawerOpen(false);
  };

  const resetDrawer = () => {
    setStageTmp("all");
    setIsoTmp("all");
  };

  const value: CRMContextType = {
    qInput,
    setQInput,
    q,
    stage,
    setStageSafe,
    iso,
    setIsoSafe,
    drawerOpen,
    setDrawerOpen,
    stageTmp,
    setStageTmp,
    isoTmp,
    setIsoTmp,
    applyDrawer,
    resetDrawer,
    hasActiveFilters,
    isoOptions,
    filtered,
    clearAll,
  };

  return <CRMContext.Provider value={value}>{children}</CRMContext.Provider>;
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

const CRMContext = createContext<CRMContextType | null>(null);

export function useCRM() {
  const ctx = useContext(CRMContext);
  if (!ctx) throw new Error("useCRM must be used within CRMProvider");
  return ctx;
}
