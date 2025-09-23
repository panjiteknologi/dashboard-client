/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardEmpty } from "./dashboard-empty";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, ArrowUpRight, Clock } from "lucide-react";

const STATE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  done: "secondary",
  approved: "secondary",
  draft: "outline",
  in_progress: "default",
  overdue: "destructive",
};

export const DashboardRecentReports = ({
  loading,
  items,
  fromISO,
  toISO,
}: {
  loading: boolean;
  items: any[];
  fromISO: string;
  toISO: string;
}) => {
  const rangeLabel = useMemo(() => {
    const fmt = (s: string) => {
      const d = new Date(s);
      if (isNaN(d.getTime())) return s;
      return d.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    };
    return `${fmt(fromISO)} — ${fmt(toISO)}`;
  }, [fromISO, toISO]);

  const prepared = useMemo(() => {
    const arr = Array.isArray(items) ? items : [];
    return arr.map((r) => {
      const dateObj = r.date ? new Date(r.date) : null;
      const relative = dateObj ? toRelative(dateObj) : "—";
      const isNew = dateObj ? isWithinDays(dateObj, 7) : false;
      return {
        title: r.name ?? "(Tanpa judul)",
        state: (r.state ?? "—") as string,
        dateStr: dateObj
          ? dateObj.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "short",
              day: "2-digit",
            })
          : "—",
        relative,
        isNew,
      };
    });
  }, [items]);

  return (
    <Card className="mt-8 overflow-hidden rounded-2xl border bg-card/60 backdrop-blur-sm transition-shadow hover:shadow-lg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">
            Recent Reports
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-full">
              <CalendarDays className="mr-1 h-3.5 w-3.5" />
              {rangeLabel}
            </Badge>
            <Badge
              variant="outline"
              className="hidden rounded-full sm:inline-flex"
            >
              {prepared.length} item
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-xl border p-3"
              >
                <div className="mt-0.5 h-8 w-8 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-44 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="h-5 w-16 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : !prepared.length ? (
          <DashboardEmpty
            title="Tidak ada report terbaru"
            subtitle={`Rentang ${rangeLabel}`}
          />
        ) : (
          <ul className="space-y-2">
            {prepared.map((r, i) => (
              <li
                key={`${r.title}-${i}`}
                className={cn(
                  "group flex items-start gap-3 rounded-xl border p-3 transition-colors",
                  "hover:bg-muted/30"
                )}
              >
                <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg border bg-background">
                  <FileText className="h-4 w-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {r.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{r.dateStr}</span>
                        <span>•</span>
                        <span className="whitespace-nowrap">{r.relative}</span>
                        {r.isNew && (
                          <Badge className="ml-1 rounded-full text-[10px]">
                            NEW
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge
                      variant={
                        STATE_VARIANT[r.state?.toLowerCase?.()] ?? "outline"
                      }
                      className="shrink-0 rounded-full"
                    >
                      {toTitle(r.state)}
                    </Badge>
                  </div>
                </div>

                <ArrowUpRight className="mt-1 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-60" />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

const toTitle = (s: string) =>
  (s || "—")
    .toString()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase());

const isWithinDays = (d: Date, days: number) => {
  const diff = Date.now() - d.getTime();
  return diff <= days * 24 * 60 * 60 * 1000;
};

const toRelative = (date: Date) => {
  try {
    const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" });
    const diffMs = date.getTime() - Date.now();
    const sec = Math.round(diffMs / 1000);
    const min = Math.round(sec / 60);
    const hour = Math.round(min / 60);
    const day = Math.round(hour / 24);
    if (Math.abs(day) >= 1) return rtf.format(day, "day");
    if (Math.abs(hour) >= 1) return rtf.format(hour, "hour");
    if (Math.abs(min) >= 1) return rtf.format(min, "minute");
    return rtf.format(sec, "second");
  } catch {
    return "";
  }
};
