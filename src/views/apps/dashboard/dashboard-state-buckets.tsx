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

export const DashboardStateBuckets = ({
  loading,
  hideZero,
  setHideZero,
  programObj,
  reportObj,
}: {
  loading: boolean;
  hideZero: boolean;
  setHideZero: (v: boolean) => void;
  programObj: Record<string, number | string>;
  reportObj: Record<string, number | string>;
}) => {
  const toNumber = (v: number | string) =>
    Number.isFinite(v) ? (v as number) : Number(v || 0);

  const filteredProgram = useMemo(() => {
    const entries = Object.entries(programObj || {});
    const shown = hideZero
      ? entries.filter(([, val]) => toNumber(val) !== 0)
      : entries;
    return Object.fromEntries(shown);
  }, [programObj, hideZero]);

  const filteredReport = useMemo(() => {
    const entries = Object.entries(reportObj || {});
    const shown = hideZero
      ? entries.filter(([, val]) => toNumber(val) !== 0)
      : entries;
    return Object.fromEntries(shown);
  }, [reportObj, hideZero]);

  const totalProgram = useMemo(
    () => Object.values(programObj || {}).reduce((a, b) => a + toNumber(b), 0),
    [programObj]
  );
  const totalReport = useMemo(
    () => Object.values(reportObj || {}).reduce((a, b) => a + toNumber(b), 0),
    [reportObj]
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
            Program: {totalProgram}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            Report: {totalReport}
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
                Bucket menampilkan jumlah per status. Aktifkan "Sembunyikan
                nilai 0" untuk fokus pada status yang memiliki data.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="ml-auto flex items-center gap-2 text-xs">
          <span className="text-muted-foreground">Sembunyikan nilai 0</span>
          <Switch checked={hideZero} onCheckedChange={setHideZero} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FancyCard
          title="Program by State"
          loading={loading}
          body={
            <DashboardGrid
              obj={filteredProgram}
              emptyLabel={
                hideZero ? "Semua 0 pada rentang ini" : "Belum ada program"
              }
            />
          }
        />

        <FancyCard
          title="Report by State"
          loading={loading}
          body={
            <DashboardGrid
              obj={filteredReport}
              emptyLabel={
                hideZero ? "Semua 0 pada rentang ini" : "Belum ada report"
              }
            />
          }
        />
      </div>
    </div>
  );
};

function FancyCard({
  title,
  loading,
  body,
  className,
}: {
  title: string;
  loading: boolean;
  body: React.ReactNode;
  className?: string;
}) {
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
}
