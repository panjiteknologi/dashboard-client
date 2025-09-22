"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { Clock, RefreshCw } from "lucide-react";

type Props = {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | number | string;
  title?: string;
  subtitle?: string;
};

export const DashboardHeader = ({
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  title = "Dashboard",
  subtitle = "View charts, reports, and timeline",
}: Props) => {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const lastText = useMemo(() => {
    if (!lastUpdated) return "sekarang";
    const d = new Date(lastUpdated);
    if (Number.isNaN(d.getTime())) return "—";
    const diffMs = Date.now() - d.getTime();
    if (diffMs < 60_000) return "baru saja";
    const mins = Math.floor(diffMs / 60_000);
    if (mins < 60) return `${mins} menit lalu`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  }, [lastUpdated]);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className={cx("text-xl font-bold leading-tight", THEME.headerText)}>
          {title}
        </h1>
        <p className={cx("text-sm", THEME.subText)}>{subtitle}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-lg border px-2 py-1 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span className="whitespace-nowrap">
            Terakhir diperbarui: {lastText}
          </span>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-full"
                onClick={onRefresh}
                disabled={isRefreshing}
                aria-label="Refresh"
              >
                <RefreshCw
                  className={cx("h-4 w-4", isRefreshing && "animate-spin")}
                />
                <span className="ml-2 text-xs">
                  {isRefreshing ? "Menyegarkan…" : "Refresh"}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Muat ulang data</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};
