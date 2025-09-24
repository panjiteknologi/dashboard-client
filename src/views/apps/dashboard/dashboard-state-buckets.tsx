"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Filter, Info } from "lucide-react";
import { CardSkeleton } from "./dashboard-skeleton";
import { DashboardGrid } from "./dashboard-grid";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

type NumLike = number | string;
type BucketObj = Record<string, NumLike>;

const toNumber = (v: NumLike) =>
  Number.isFinite(v) ? (v as number) : Number(v || 0);

const PROGRAM_ORDER = [
  "new",
  "confirm",
  "done_stage2",
  "done_surveillance1",
  "done_surveillance2",
  "done_recertification",
  "done",
];
const PROGRAM_LABELS: Record<string, string> = {
  new: "New",
  confirm: "Confirm",
  done_stage2: "Done Stage 2",
  done_surveillance1: "Done Surveillance 1",
  done_surveillance2: "Done Surveillance 2",
  done_recertification: "Done Recertification",
  done: "Done",
};

const REPORT_ORDER = ["new", "confirm", "done"];
const REPORT_LABELS: Record<string, string> = {
  new: "New",
  confirm: "Confirm",
  done: "Done",
};

const TSI_ISO_ORDER = ["new", "waiting", "approved_head", "approved", "reject"];
const TSI_ISO_LABELS: Record<string, string> = {
  new: "New",
  waiting: "Waiting",
  approved_head: "Approved (Head)",
  approved: "Approved",
  reject: "Rejected",
};

const TSI_ISPO_ORDER = ["new", "approved"];
const TSI_ISPO_LABELS: Record<string, string> = {
  new: "New",
  approved: "Approved",
};

export const DashboardStateBuckets = ({
  loading,
  hideZero,
  setHideZero,
  programObj,
  reportObj,
  tsiIsoObj,
  tsiIspoObj,
}: {
  loading: boolean;
  hideZero: boolean;
  setHideZero: (v: boolean) => void;
  programObj: BucketObj;
  reportObj: BucketObj;
  tsiIsoObj?: BucketObj;
  tsiIspoObj?: BucketObj;
}) => {
  const filterZeros = (obj?: BucketObj) => {
    if (!obj) return {};
    const entries = Object.entries(obj);
    const shown = hideZero
      ? entries.filter(([, v]) => toNumber(v) !== 0)
      : entries;
    return Object.fromEntries(shown);
  };

  const totals = useMemo(() => {
    const sum = (obj?: BucketObj) =>
      Object.values(obj ?? {}).reduce<number>((acc, v) => acc + toNumber(v), 0);

    return {
      program: sum(programObj),
      report: sum(reportObj),
    };
  }, [programObj, reportObj]);

  const sections = useMemo(
    () =>
      [
        {
          title: "Program by State",
          obj: programObj,
          empty: "Belum ada program",
          order: PROGRAM_ORDER,
          labels: PROGRAM_LABELS,
        },
        {
          title: "Report by State",
          obj: reportObj,
          empty: "Belum ada report",
          order: REPORT_ORDER,
          labels: REPORT_LABELS,
        },
        tsiIsoObj && {
          title: "TSI ISO by State",
          obj: tsiIsoObj,
          empty: "Belum ada TSI ISO",
          order: TSI_ISO_ORDER,
          labels: TSI_ISO_LABELS,
        },
        tsiIspoObj && {
          title: "TSI ISPO by State",
          obj: tsiIspoObj,
          empty: "Belum ada TSI ISPO",
          order: TSI_ISPO_ORDER,
          labels: TSI_ISPO_LABELS,
        },
      ].filter(Boolean) as {
        title: string;
        obj: BucketObj;
        empty: string;
        order: string[];
        labels: Record<string, string>;
      }[],
    [programObj, reportObj, tsiIsoObj, tsiIspoObj]
  );

  return (
    <div className="mt-8">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
          <Filter className="h-4 w-4" />
          State Buckets
        </h2>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            Program: {totals.program}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            Report: {totals.report}
          </Badge>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  aria-label="Penjelasan"
                >
                  <Info className="h-3.5 w-3.5" />
                  Bantuan
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs">
                Bucket menampilkan jumlah per status. Aktifkan{" "}
                <q>Sembunyikan nilai 0</q> untuk fokus pada status yang memiliki
                data.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Sembunyikan nilai 0</span>
          <Switch checked={hideZero} onCheckedChange={setHideZero} />
        </div>
      </div>

      <div className="mt-4 grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2">
        {sections.map(({ title, obj, empty }) => {
          const filtered = filterZeros(obj);
          return (
            <FancyCard
              key={title}
              title={title}
              loading={loading}
              body={
                loading ? (
                  <CardSkeleton size="sm" />
                ) : (
                  <DashboardGrid
                    obj={filtered}
                    emptyLabel={hideZero ? "Semua 0 pada rentang ini" : empty}
                  />
                )
              }
            />
          );
        })}
      </div>
    </div>
  );
};

const FancyCard = ({
  title,
  loading,
  body,
  className,
}: {
  title: string;
  loading: boolean;
  body: React.ReactNode;
  className?: string;
}) => {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card transition-all",
        "hover:shadow-lg hover:border-primary/40",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm">
          <span>{title}</span>
          {loading ? (
            <span className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
              Loading
              <span className="inline-block size-2 animate-pulse rounded-full bg-muted-foreground" />
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? <CardSkeleton size="sm" /> : body}
      </CardContent>

      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <div className="absolute -inset-8 rounded-[24px] bg-gradient-to-br from-primary/5 via-transparent to-transparent blur-2xl" />
      </div>
    </Card>
  );
};
