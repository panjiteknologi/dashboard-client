/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useSummaryQuery } from "@/hooks/use-summary";

type ProgramKey =
  | "new"
  | "confirm"
  | "done_stage2"
  | "done_surveillance1"
  | "done_surveillance2"
  | "done_recertification"
  | "done";
type ReportKey = "new" | "confirm" | "done";
type TsiIsoKey = "new" | "waiting" | "approved_head" | "approved" | "reject";
type TsiIspoKey = "new" | "approved";

type SummaryRaw = {
  program_by_state: Record<ProgramKey, number>;
  report_by_state: Record<ReportKey, number>;
  tsi_iso_by_state: Record<TsiIsoKey, number>;
  tsi_ispo_by_state: Record<TsiIspoKey, number>;
  contracts_total: number;
  contracts_expiring_60d: number;
  contracts_overdue: number;
};

type SummaryMeta = {
  partner_id: number;
  from: string | null;
  to: string | null;
  missing_models: string[];
};

type SummaryResp = {
  success: boolean;
  data: SummaryRaw;
  meta: SummaryMeta;
};

type KV<L extends string> = { key: L; label: string; value: number };

type Ctx = {
  data?: SummaryRaw;
  meta?: SummaryMeta;
  programs: KV<ProgramKey>[];
  reports: KV<ReportKey>[];
  tsiIso: KV<TsiIsoKey>[];
  tsiIspo: KV<TsiIspoKey>[];
  kpis: { total: number; expiring60d: number; overdue: number };
  from: string | null;
  to: string | null;
  setFrom: (v: string | null) => void;
  setTo: (v: string | null) => void;
  isEmpty: boolean;
  errorMessage: string | null;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

const SummaryContext = createContext<Ctx | null>(null);

const PROGRAM_ORDER: ProgramKey[] = [
  "new",
  "confirm",
  "done_stage2",
  "done_surveillance1",
  "done_surveillance2",
  "done_recertification",
  "done",
];
const PROGRAM_LABEL: Record<ProgramKey, string> = {
  new: "New",
  confirm: "Confirm",
  done_stage2: "Done Stage 2",
  done_surveillance1: "Done Surveillance 1",
  done_surveillance2: "Done Surveillance 2",
  done_recertification: "Done Recertification",
  done: "Done",
};

const REPORT_ORDER: ReportKey[] = ["new", "confirm", "done"];
const REPORT_LABEL: Record<ReportKey, string> = {
  new: "New",
  confirm: "Confirm",
  done: "Done",
};

const TSI_ISO_ORDER: TsiIsoKey[] = [
  "new",
  "waiting",
  "approved_head",
  "approved",
  "reject",
];
const TSI_ISO_LABEL: Record<TsiIsoKey, string> = {
  new: "New",
  waiting: "Waiting",
  approved_head: "Approved (Head)",
  approved: "Approved",
  reject: "Reject",
};

const TSI_ISPO_ORDER: TsiIspoKey[] = ["new", "approved"];
const TSI_ISPO_LABEL: Record<TsiIspoKey, string> = {
  new: "New",
  approved: "Approved",
};

const toKV = <T extends string>(
  obj: Record<T, number> | undefined,
  order: T[],
  labelMap: Record<T, string>
): KV<T>[] => {
  const safe = obj ?? ({} as Record<T, number>);
  return order.map((k) => ({
    key: k,
    label: labelMap[k],
    value: Number(safe[k] ?? 0),
  }));
};

const fmtDateID = (d?: string | null) => {
  if (!d) return null;
  try {
    return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium" }).format(
      new Date(d)
    );
  } catch {
    return d;
  }
};

const fmtRange = (from?: string | null, to?: string | null) => {
  const f = fmtDateID(from);
  const t = fmtDateID(to);
  if (f && t) return `${f} – ${t}`;
  if (f) return `mulai ${f}`;
  if (t) return `hingga ${t}`;
  return null;
};

export const SummaryProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, isFetching, isError, refetch } = useSummaryQuery({
    staleTime: 5 * 60 * 1000,
  }) as {
    data?: SummaryResp;
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
  };

  const [from, setFrom] = useState<string | null>(data?.meta?.from ?? null);
  const [to, setTo] = useState<string | null>(data?.meta?.to ?? null);

  const raw = data?.data;
  const meta = data?.meta;

  const programs = useMemo(
    () => toKV(raw?.program_by_state, PROGRAM_ORDER, PROGRAM_LABEL),
    [raw?.program_by_state]
  );
  const reports = useMemo(
    () => toKV(raw?.report_by_state, REPORT_ORDER, REPORT_LABEL),
    [raw?.report_by_state]
  );
  const tsiIso = useMemo(
    () => toKV(raw?.tsi_iso_by_state, TSI_ISO_ORDER, TSI_ISO_LABEL),
    [raw?.tsi_iso_by_state]
  );
  const tsiIspo = useMemo(
    () => toKV(raw?.tsi_ispo_by_state, TSI_ISPO_ORDER, TSI_ISPO_LABEL),
    [raw?.tsi_ispo_by_state]
  );

  const kpis = useMemo(
    () => ({
      total: Number(raw?.contracts_total ?? 0),
      expiring60d: Number(raw?.contracts_expiring_60d ?? 0),
      overdue: Number(raw?.contracts_overdue ?? 0),
    }),
    [raw?.contracts_total, raw?.contracts_expiring_60d, raw?.contracts_overdue]
  );

  const allNumbers = useMemo(() => {
    const arr = [
      ...programs,
      ...reports,
      ...tsiIso,
      ...tsiIspo,
      { key: "total", label: "total", value: kpis.total } as any,
      {
        key: "expiring60d",
        label: "expiring60d",
        value: kpis.expiring60d,
      } as any,
      { key: "overdue", label: "overdue", value: kpis.overdue } as any,
    ];
    return arr.map((x) => x.value);
  }, [programs, reports, tsiIso, tsiIspo, kpis]);

  const isEmpty = useMemo(
    () => allNumbers.every((n) => Number(n) === 0),
    [allNumbers]
  );

  const errorMessage = useMemo(() => {
    if (isLoading) return null;
    if (!raw) {
      const range = fmtRange(meta?.from, meta?.to);
      const parts = [
        "Data tidak tersedia",
        range ? `untuk periode ${range}` : null,
        meta?.partner_id ? `(Partner ID ${meta.partner_id})` : null,
      ].filter(Boolean);
      return parts.join(" ");
    }
    if (isEmpty) {
      const range = fmtRange(meta?.from, meta?.to);
      const missing = meta?.missing_models?.length
        ? `Catatan: ${meta.missing_models.join(", ")} belum tersedia.`
        : null;
      const parts = [
        "Data tidak ada",
        range ? `untuk periode ${range}` : null,
        meta?.partner_id ? `(Partner ID ${meta.partner_id})` : null,
        missing,
      ].filter(Boolean);
      return parts.join(" ");
    }
    return null;
  }, [
    isLoading,
    raw,
    isEmpty,
    meta?.from,
    meta?.to,
    meta?.partner_id,
    meta?.missing_models,
  ]);

  const value: Ctx = {
    data: raw,
    meta,
    programs,
    reports,
    tsiIso,
    tsiIspo,
    kpis,
    from,
    to,
    setFrom,
    setTo,
    isEmpty,
    errorMessage,
    isLoading,
    isFetching,
    isError,
    refetch,
  };

  return (
    <SummaryContext.Provider value={value}>{children}</SummaryContext.Provider>
  );
};

export const useSummaryContext = () => {
  const ctx = useContext(SummaryContext);
  if (!ctx)
    throw new Error("useSummaryContext must be used within SummaryProvider");
  return ctx;
};
