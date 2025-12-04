"use client";

import { RefreshCw, BadgeInfo } from "lucide-react";
import { cx } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { THEME } from "@/constant";
import { CRMSkeleton } from "./crm-skeleton";
import { CRMEmpty } from "./crm-empty";
import { CRMFilters } from "./crm-filters";
import { CRMPagination } from "./crm-pagination";
import { CRMProvider, useCRM } from "@/context/crm-context";
import { CRMStandard, CRMViewProps, InnerViewProps } from "@/types/crm";

export const CRMView = ({
  data,
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  refetch,
  isFetching,
}: CRMViewProps) => {
  return (
    <CRMProvider data={data} onResetPage={() => onPageChange(1)}>
      <InnerView
        pagination={pagination}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        isLoading={isLoading}
        refetch={refetch}
        isFetching={isFetching}
      />
    </CRMProvider>
  );
};

const InnerView = ({
  pagination,
  page,
  limit,
  onPageChange,
  onLimitChange,
  isLoading,
  refetch,
  isFetching,
}: InnerViewProps) => {
  const { filtered } = useCRM();
  const isBusy = isLoading || isFetching;

  const safeLimit = Math.max(1, limit ?? 1);
  const totalCount = pagination?.total_count ?? filtered.length;

  const totalPages =
    totalCount === 0
      ? 1
      : pagination?.total_pages ??
        Math.max(1, Math.ceil(totalCount / safeLimit));

  const hasPrev = page > 1;
  const hasNext =
    totalPages > 1 &&
    (typeof pagination?.has_next === "boolean"
      ? pagination.has_next
      : page < totalPages);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <h1
            className={cx(
              "text-2xl font-semibold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            CRM Lanjut
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Pantau data kontrak dan tahapan audit klien secara terorganisir dan
            mudah dipantau.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
            Total data:{" "}
            <span className="ml-1 font-semibold text-foreground">
              {totalCount.toLocaleString("id-ID")}
            </span>
          </span>

          <Button
            variant="outline"
            size="sm"
            aria-label="Refresh"
            onClick={() => refetch?.()}
            disabled={isFetching}
            title="Refresh data"
            className="inline-flex items-center gap-2"
          >
            <RefreshCw
              className={cx("h-4 w-4", isFetching && "animate-spin")}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      <CRMFilters onPageChange={onPageChange} />

      <Card className="rounded-xl border border-border/80 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <BadgeInfo className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">
                Daftar CRM
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                Menampilkan ringkasan ISO, tahapan audit, dan nilai kontrak.
              </p>
            </div>
          </div>

          <span className="text-xs text-muted-foreground">
            Halaman{" "}
            <span className="font-medium text-foreground">
              {Math.min(page, totalPages)}
            </span>{" "}
            dari{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
        </CardHeader>

        <CardContent className="pt-0">
          {isBusy ? (
            <div className="border-t">
              <CRMSkeleton />
            </div>
          ) : filtered.length === 0 ? (
            <div className="border-t">
              <CRMEmpty />
            </div>
          ) : (
            <div className="w-full overflow-x-auto border-t">
              <Table className="min-w-[720px] text-sm">
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-[220px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      ISO Standards
                    </TableHead>
                    <TableHead className="w-[200px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Tahapan Audit
                    </TableHead>
                    <TableHead className="w-[180px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Level
                    </TableHead>
                    <TableHead className="w-[220px] text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Sales
                    </TableHead>
                    <TableHead className="w-[200px] text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Nilai Kontrak
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((c) => {
                    const isoNames =
                      (c.iso_standards ?? [])
                        .map((s: CRMStandard) => s.name)
                        .join(", ") || "-";

                    const nilaiKontrak =
                      typeof c.nilai_kontrak === "number"
                        ? c.nilai_kontrak.toLocaleString("id-ID")
                        : "-";

                    const tahapan = c.tahapan_audit ?? "-";
                    const tahapanLower = tahapan.toLowerCase();

                    const tahapanColor =
                      tahapanLower.includes("1") || tahapanLower.includes("i")
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : tahapanLower.includes("2") ||
                          tahapanLower.includes("ii")
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-muted text-muted-foreground border border-border/40";

                    return (
                      <TableRow
                        key={c.id}
                        className="transition-colors hover:bg-muted/40"
                      >
                        <TableCell>
                          <p className="font-medium text-foreground">
                            {isoNames}
                          </p>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cx(
                              "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium",
                              tahapanColor
                            )}
                          >
                            {tahapan}
                          </span>
                        </TableCell>
                        <TableCell className="capitalize text-muted-foreground">
                          {c.level ?? "-"}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{c.sales_person ?? "-"}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="inline-flex items-center justify-end font-semibold tabular-nums">
                            {nilaiKontrak !== "-" ? `Rp ${nilaiKontrak}` : "-"}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {!isBusy && (
        <CRMPagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          limit={limit}
          onLimitChange={onLimitChange}
          filteredCount={filtered.length}
          totalCount={totalCount}
          hasPrev={hasPrev}
          hasNext={hasNext}
        />
      )}
    </div>
  );
};
