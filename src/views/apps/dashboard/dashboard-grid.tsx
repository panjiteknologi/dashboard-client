import { useMemo } from "react";
import { formatNumberID } from "@/utils";
import { DashboardEmpty } from "./dashboard-empty";

type GridCols = {
  base?: number;
  md?: number;
  xl?: number;
};

export function DashboardGrid({
  obj,
  emptyLabel,
  sort = "value",
  descending = true,
  cols,
  className = "",
}: {
  obj: Record<string, number | string | null | undefined>;
  emptyLabel?: string;
  sort?: "value" | "key" | "none";
  descending?: boolean;
  cols?: GridCols;
  className?: string;
}) {
  const entries = useMemo(() => {
    const raw = Object.entries(obj ?? {});
    if (raw.length === 0) return [];

    const normalized = raw.map(([k, v]) => {
      const num =
        typeof v === "number"
          ? v
          : v == null
          ? NaN
          : Number(String(v).replaceAll(",", "").trim());
      return [k, num] as [string, number];
    });

    if (sort === "none") return normalized;

    if (sort === "key") {
      return normalized.sort((a, b) => {
        const cmp = a[0].localeCompare(b[0], "id");
        return descending ? -cmp : cmp;
      });
    }

    return normalized.sort((a, b) => {
      const va = Number.isFinite(a[1]) ? a[1] : -Infinity;
      const vb = Number.isFinite(b[1]) ? b[1] : -Infinity;
      return descending ? vb - va : va - vb;
    });
  }, [obj, sort, descending]);

  if (!entries.length) {
    return <DashboardEmpty title={emptyLabel ?? "Tidak ada data"} />;
  }

  const gridBase = cols?.base ?? 2;
  const gridMd = cols?.md ?? 3;
  const gridXl = cols?.xl ?? 4;

  const titleCase = (s: string) =>
    s
      .replaceAll("_", " ")
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  return (
    <div
      className={[
        `grid gap-3`,
        `grid-cols-${gridBase}`,
        `md:grid-cols-${gridMd}`,
        `xl:grid-cols-${gridXl}`,
        className,
      ].join(" ")}
    >
      {entries.map(([k, v]) => {
        const isValid = Number.isFinite(v);
        return (
          <div
            key={k}
            className="rounded-xl border p-3 transition-colors hover:bg-muted/40"
            title={k}
          >
            <div className="truncate text-[11px] uppercase tracking-wide text-muted-foreground">
              {titleCase(k)}
            </div>
            <div className="text-xl font-semibold">
              {isValid ? formatNumberID(v as number) : "—"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
