import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";

export type StageValue = "all" | "s1" | "s2";
export type UrgencyValue = "all" | "low" | "medium" | "high" | "critical";

export type Certificate = {
  id: number;
  name: string;
  nomor_sertifikat: string;
  iso_reference?: { id: number; name: string; scope?: string | null };
  iso_standards?: { id: number; name: string }[];
  expiry_date?: string | null;
  days_until_expiry?: number | null;
  reminder_type?: string | null;
  urgency_level?: string | null;
  surveillance_stage?: string | null;
};

type Ctx = {
  qInput: string;
  setQInput: Dispatch<SetStateAction<string>>;
  q: string;
  stage: StageValue;
  setStageSafe: (v: StageValue) => void;
  urgency: UrgencyValue;
  setUrgencySafe: (v: UrgencyValue) => void;
  iso: string;
  setIsoSafe: (v: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  stageTmp: StageValue;
  setStageTmp: Dispatch<SetStateAction<StageValue>>;
  urgencyTmp: UrgencyValue;
  setUrgencyTmp: Dispatch<SetStateAction<UrgencyValue>>;
  isoTmp: string;
  setIsoTmp: Dispatch<SetStateAction<string>>;
  applyDrawer: () => void;
  resetDrawer: () => void;
  hasActiveFilters: boolean;
  isoOptions: string[];
  filtered: Certificate[];
  clearAll: () => void;
};

const ReminderSurveillanceContext = createContext<Ctx | null>(null);

export function useReminderSurveillance() {
  const ctx = useContext(ReminderSurveillanceContext);
  if (!ctx)
    throw new Error(
      "useReminderSurveillance must be used within ReminderSurveillanceProvider"
    );
  return ctx;
}

export function ReminderSurveillanceProvider({
  data,
  onResetPage,
  debounceMs = 300,
  children,
}: {
  data: Certificate[];
  onResetPage?: () => void;
  debounceMs?: number;
  children: React.ReactNode;
}) {
  const [qInput, setQInput] = useState("");
  const q = useDebouncedValue(qInput, debounceMs);

  const [stage, setStage] = useState<StageValue>("all");
  const [urgency, setUrgency] = useState<UrgencyValue>("all");
  const [iso, setIso] = useState<string>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stageTmp, setStageTmp] = useState<StageValue>("all");
  const [urgencyTmp, setUrgencyTmp] = useState<UrgencyValue>("all");
  const [isoTmp, setIsoTmp] = useState<string>("all");

  useEffect(() => {
    if (drawerOpen) {
      setStageTmp(stage);
      setUrgencyTmp(urgency);
      setIsoTmp(iso);
    }
  }, [drawerOpen]); // eslint-disable-line

  const isoOptions = useMemo(() => {
    const s = new Set<string>();
    (data ?? []).forEach((c) =>
      c.iso_standards?.forEach((i) => i?.name && s.add(i.name))
    );
    return Array.from(s);
  }, [data]);

  const filtered = useMemo(() => {
    const qlc = q.toLowerCase();
    return (data ?? []).filter((c) => {
      const queryHit =
        !q ||
        `${c.name} ${c.nomor_sertifikat} ${c.iso_reference?.scope ?? ""} ${(
          c.iso_standards ?? []
        )
          .map((i) => i.name)
          .join(" ")}`
          .toLowerCase()
          .includes(qlc);

      const stg = (c.surveillance_stage ?? "").toLowerCase();
      const stageHit =
        stage === "all" ||
        (stage === "s1" && stg.includes("surveillance 1")) ||
        (stage === "s2" && stg.includes("surveillance 2"));

      const urgencyHit =
        urgency === "all" || (c.urgency_level ?? "").toLowerCase() === urgency;

      const isoHit =
        iso === "all" || (c.iso_standards ?? []).some((i) => i.name === iso);

      return queryHit && stageHit && urgencyHit && isoHit;
    });
  }, [data, q, stage, urgency, iso]);

  const hasActiveFilters =
    stage !== "all" || urgency !== "all" || iso !== "all";

  const setStageSafe = (v: StageValue) => {
    setStage(v);
    onResetPage?.();
  };
  const setUrgencySafe = (v: UrgencyValue) => {
    setUrgency(v);
    onResetPage?.();
  };
  const setIsoSafe = (v: string) => {
    setIso(v);
    onResetPage?.();
  };

  const clearAll = () => {
    setStage("all");
    setUrgency("all");
    setIso("all");
    onResetPage?.();
  };

  const applyDrawer = () => {
    setStageSafe(stageTmp);
    setUrgencySafe(urgencyTmp);
    setIsoSafe(isoTmp);
    setDrawerOpen(false);
  };

  const resetDrawer = () => {
    setStageTmp("all");
    setUrgencyTmp("all");
    setIsoTmp("all");
  };

  const value: Ctx = {
    qInput,
    setQInput,
    q,
    stage,
    setStageSafe,
    urgency,
    setUrgencySafe,
    iso,
    setIsoSafe,
    drawerOpen,
    setDrawerOpen,
    stageTmp,
    setStageTmp,
    urgencyTmp,
    setUrgencyTmp,
    isoTmp,
    setIsoTmp,
    applyDrawer,
    resetDrawer,
    hasActiveFilters,
    isoOptions,
    filtered,
    clearAll,
  };

  return (
    <ReminderSurveillanceContext.Provider value={value}>
      {children}
    </ReminderSurveillanceContext.Provider>
  );
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
