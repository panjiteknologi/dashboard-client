/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Calendar,
  CalendarDays,
  CalendarRange,
  Filter,
  FilterIcon,
  LineChart,
  PanelTop,
  RefreshCw,
  Sliders,
} from "lucide-react";
import { TimelineProps } from "@/types/dashboard";
import {
  clampMonth,
  fmtDate,
  fmtMonth,
  fmtYear,
  parseMonth,
  rangeMonths,
} from "@/utils";

export const DashboardReportTimelines = (props: TimelineProps) => {
  const {
    loading,
    data,
    monthFrom,
    monthTo,
    setMonthFrom,
    setMonthTo,
    hideZero,
    setHideZero,
    applyPreset,
  } = props;

  const [granularity, setGranularity] = useState<"YEAR" | "MONTH" | "DATE">(
    "MONTH"
  );

  const [fromY, setFromY] = useState(fmtYear(parseMonth(monthFrom)));
  const [toY, setToY] = useState(fmtYear(parseMonth(monthTo)));
  const [fromM, setFromM] = useState(monthFrom);
  const [toM, setToM] = useState(monthTo);
  const [fromD, setFromD] = useState(
    fmtDate(
      new Date(
        parseMonth(monthFrom).getFullYear(),
        parseMonth(monthFrom).getMonth(),
        1
      )
    )
  );
  const [toD, setToD] = useState(
    fmtDate(
      new Date(
        parseMonth(monthTo).getFullYear(),
        parseMonth(monthTo).getMonth() + 1,
        0
      )
    )
  );

  useEffect(() => {
    setFromM(clampMonth(monthFrom));
    setToM(clampMonth(monthTo));
    setFromY(fmtYear(parseMonth(monthFrom)));
    setToY(fmtYear(parseMonth(monthTo)));
    const fd = new Date(
      parseMonth(monthFrom).getFullYear(),
      parseMonth(monthFrom).getMonth(),
      1
    );
    const td = new Date(
      parseMonth(monthTo).getFullYear(),
      parseMonth(monthTo).getMonth() + 1,
      0
    );
    setFromD(fmtDate(fd));
    setToD(fmtDate(td));
  }, [monthFrom, monthTo]);

  const applyRange = () => {
    if (granularity === "YEAR") {
      const from = `${fromY}-01`;
      const to = `${toY}-12`;
      setMonthFrom(from);
      setMonthTo(to);
    } else if (granularity === "MONTH") {
      setMonthFrom(clampMonth(fromM));
      setMonthTo(clampMonth(toM));
    } else {
      const f = new Date(fromD);
      const t = new Date(toD);
      const from = fmtMonth(new Date(f.getFullYear(), f.getMonth(), 1));
      const to = fmtMonth(new Date(t.getFullYear(), t.getMonth(), 1));
      setMonthFrom(from);
      setMonthTo(to);
    }
  };

  const allKeys = useMemo(() => {
    const s = new Set<string>();
    data.forEach((p) => Object.keys(p.buckets || {}).forEach((k) => s.add(k)));
    return Array.from(s).sort();
  }, [data]);

  type ChartPoint = { x: string } & Record<string, number>;
  const chartData: ChartPoint[] = useMemo(() => {
    const map = new Map<string, Record<string, number>>();

    if (granularity === "YEAR") {
      data.forEach((p) => {
        const y = p.month.slice(0, 4);
        const cur = map.get(y) || {};
        for (const [k, v] of Object.entries(p.buckets || {})) {
          cur[k] = (cur[k] || 0) + (Number(v) || 0);
        }
        map.set(y, cur);
      });
    } else if (granularity === "MONTH") {
      const months = rangeMonths(monthFrom, monthTo);
      months.forEach((m) => map.set(m, {}));
      data.forEach((p) => {
        const cur = map.get(p.month) || {};
        for (const [k, v] of Object.entries(p.buckets || {})) {
          cur[k] = (cur[k] || 0) + (Number(v) || 0);
        }
        map.set(p.month, cur);
      });
    } else {
      const months = rangeMonths(monthFrom, monthTo);
      months.forEach((m) => map.set(m, {}));
      data.forEach((p) => {
        const cur = map.get(p.month) || {};
        for (const [k, v] of Object.entries(p.buckets || {})) {
          cur[k] = (cur[k] || 0) + (Number(v) || 0);
        }
        map.set(p.month, cur);
      });
    }

    const arr: ChartPoint[] = Array.from(map.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .map(([x, buckets]) => {
        const row: any = { x };
        allKeys.forEach((k) => {
          row[k] = Number(buckets[k] || 0);
        });
        return row;
      });

    return arr;
  }, [data, allKeys, granularity, monthFrom, monthTo]);

  const tooltipFormatter = (value: any) =>
    (Number(value) || 0).toLocaleString("id-ID");
  const axisFormatter = (val: string) => {
    if (granularity === "YEAR") return val;
    if (granularity === "MONTH") {
      const [y, m] = val.split("-");
      return `${m}/${y.slice(2)}`;
    }
    const [y, m] = val.split("-");
    return `${m}/${y.slice(2)}`;
  };

  return (
    <div className="mt-8">
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <FilterIcon className="h-4 w-4" />
        Reports Chart Timeline
      </h2>
      <div className="mt-3">
        <Card
          className={cn(
            "group relative overflow-hidden rounded-2xl border bg-card transition-all",
            "hover:shadow-lg hover:border-primary/40"
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-semibold">
              <span className="inline-flex items-center gap-2">
                <LineChart className="h-4 w-4" />
                Reports Timeline
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full text-xs"
                    >
                      <PanelTop className="mr-1.5 h-3.5 w-3.5" />
                      Preset
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuLabel className="text-xs">
                      Rentang Cepat
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => applyPreset("ytd")}
                    >
                      Year to Date
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => applyPreset("last30")}
                    >
                      30 hari terakhir
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => applyPreset("last90")}
                    >
                      90 hari terakhir
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-xs"
                      onClick={() => applyPreset("full")}
                    >
                      Semua
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="ml-1 flex items-center gap-2 rounded-full border px-2 py-1">
                  <Switch
                    id="hidezero"
                    checked={hideZero}
                    onCheckedChange={(v) => setHideZero(Boolean(v))}
                  />
                  <Label htmlFor="hidezero" className="text-xs">
                    Hide 0
                  </Label>
                </div>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3 pt-0">
            <div className="rounded-xl border bg-background p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  <Sliders className="mr-1.5 h-3.5 w-3.5" />
                  Filter
                </Badge>

                <div className="ml-1 inline-flex overflow-hidden rounded-lg border">
                  {(["YEAR", "MONTH", "DATE"] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGranularity(g)}
                      className={cn(
                        "h-8 px-3 text-xs",
                        granularity === g
                          ? "bg-primary text-primary-foreground"
                          : "bg-card"
                      )}
                    >
                      {g === "YEAR"
                        ? "Tahun"
                        : g === "MONTH"
                        ? "Bulan"
                        : "Tanggal"}
                    </button>
                  ))}
                </div>

                <Separator orientation="vertical" className="mx-2 h-6" />

                {granularity === "YEAR" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="number"
                        className="h-8 w-24 rounded-md border bg-card px-2 text-xs"
                        value={fromY}
                        onChange={(e) =>
                          setFromY(
                            e.target.value.replace(/[^\d]/g, "").slice(0, 4)
                          )
                        }
                        placeholder="YYYY"
                      />
                      <span className="text-xs">s.d.</span>
                      <input
                        type="number"
                        className="h-8 w-24 rounded-md border bg-card px-2 text-xs"
                        value={toY}
                        onChange={(e) =>
                          setToY(
                            e.target.value.replace(/[^\d]/g, "").slice(0, 4)
                          )
                        }
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                )}

                {granularity === "MONTH" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarRange className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="month"
                        className="h-8 rounded-md border bg-card px-2 text-xs"
                        value={fromM}
                        onChange={(e) => setFromM(clampMonth(e.target.value))}
                      />
                      <span className="text-xs">s.d.</span>
                      <input
                        type="month"
                        className="h-8 rounded-md border bg-card px-2 text-xs"
                        value={toM}
                        onChange={(e) => setToM(clampMonth(e.target.value))}
                      />
                    </div>
                  </div>
                )}

                {granularity === "DATE" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        className="h-8 rounded-md border bg-card px-2 text-xs"
                        value={fromD}
                        onChange={(e) => setFromD(e.target.value)}
                      />
                      <span className="text-xs">s.d.</span>
                      <input
                        type="date"
                        className="h-8 rounded-md border bg-card px-2 text-xs"
                        value={toD}
                        onChange={(e) => setToD(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="ml-auto h-8 rounded-full text-xs"
                  onClick={applyRange}
                >
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                  Terapkan
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border p-3">
              <div className="mb-2 flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  {granularity === "YEAR"
                    ? "Agregasi per Tahun"
                    : granularity === "MONTH"
                    ? "Agregasi per Bulan"
                    : "Agregasi per Tanggal"}
                </div>
                <Badge variant="secondary" className="rounded-full">
                  <Filter className="mr-1.5 h-3.5 w-3.5" />
                  {granularity === "YEAR"
                    ? `${fromY}—${toY}`
                    : granularity === "MONTH"
                    ? `${fromM}—${toM}`
                    : `${fromD}—${toD}`}
                </Badge>
              </div>

              <div className="h-[320px] w-full">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="animate-pulse text-xs text-muted-foreground">
                      Memuat chart…
                    </div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 8, right: 12, bottom: 4, left: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="x"
                        tickFormatter={axisFormatter}
                        fontSize={12}
                        tickMargin={6}
                      />
                      <YAxis fontSize={12} tickMargin={6} />
                      <RTooltip
                        formatter={(v) => tooltipFormatter(v)}
                        labelFormatter={(l) =>
                          granularity === "YEAR" ? `Tahun ${l}` : `Periode ${l}`
                        }
                      />
                      <Legend />
                      {allKeys.map((k, i) => (
                        <Area
                          key={i}
                          type="monotone"
                          dataKey={k}
                          stackId="1"
                          fillOpacity={0.7}
                        />
                      ))}
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
