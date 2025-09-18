import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  RefreshCw,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { useSummaryContext } from "@/context/summary-context";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { SummarySkeleton } from "./summary-skeleton";
import { SummaryGroup } from "./summary-group";

const nf = new Intl.NumberFormat("id-ID");

const SmallKpi = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
}) => {
  return (
    <Card className="rounded-lg border bg-card/60">
      <CardContent className="flex items-center gap-3 p-3">
        <div className="grid h-9 w-9 place-items-center rounded-md border bg-muted">
          {icon}
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">{title}</div>
          <div className="text-base font-semibold leading-tight">
            {nf.format(value)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const SummaryView = () => {
  const {
    programs,
    reports,
    tsiIso,
    tsiIspo,
    kpis,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useSummaryContext();

  const programItems = useMemo(
    () => programs.map((x) => ({ label: x.label, value: x.value })),
    [programs]
  );
  const reportItems = useMemo(
    () => reports.map((x) => ({ label: x.label, value: x.value })),
    [reports]
  );
  const tsiIsoItems = useMemo(
    () => tsiIso.map((x) => ({ label: x.label, value: x.value })),
    [tsiIso]
  );
  const tsiIspoItems = useMemo(
    () => tsiIspo.map((x) => ({ label: x.label, value: x.value })),
    [tsiIspo]
  );

  return (
    <section className="mx-auto w-full max-w-screen-2xl space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Dashboard Summary
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Rekap status program, laporan, TSI, dan kontrak.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          aria-label="Refresh"
          onClick={() => refetch?.()}
          disabled={isFetching}
          className="gap-2"
          title="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading || isFetching ? (
        <SummarySkeleton />
      ) : (
        !isError && (
          <div className="space-y-5 sm:space-y-6 lg:space-y-7">
            <div className="grid gap-3 sm:gap-4 lg:gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
              <SmallKpi
                title="Contracts Total"
                value={kpis.total}
                icon={<FileText className="h-4 w-4" />}
              />
              <SmallKpi
                title="Expiring ≤ 60 hari"
                value={kpis.expiring60d}
                icon={<Clock className="h-4 w-4" />}
              />
              <SmallKpi
                title="Overdue"
                value={kpis.overdue}
                icon={<AlertTriangle className="h-4 w-4" />}
              />
            </div>

            <div className="h-px w-full bg-border/70" />

            <div className="space-y-4 sm:space-y-5 lg:space-y-6">
              <SummaryGroup
                title="Program by State"
                items={programItems}
                icon={<Workflow className="h-4 w-4" />}
              />
              <SummaryGroup
                title="Report by State"
                items={reportItems}
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
              <SummaryGroup
                title="TSI ISO by State"
                items={tsiIsoItems}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
              <SummaryGroup
                title="TSI ISPO by State"
                items={tsiIspoItems}
                icon={<ShieldCheck className="h-4 w-4" />}
              />
            </div>
          </div>
        )
      )}
    </section>
  );
};
