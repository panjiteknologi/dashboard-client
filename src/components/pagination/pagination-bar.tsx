"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

export type PaginationBarProps = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  pageSize?: number;
  onPageSizeChange?: (n: number) => void;
  pageSizeOptions?: readonly number[];
  totalCount?: number;
  filteredCount?: number;
  compact?: boolean;
  disabled?: boolean;
  className?: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

export function PaginationBar({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  totalCount,
  filteredCount,
  compact,
  disabled,
  className,
}: PaginationBarProps) {
  const prevDisabled = disabled || page <= 1;
  const nextDisabled = disabled || !(page < totalPages && totalPages > 1);

  return (
    <div
      className={[
        "w-full gap-2 border-t pt-3",
        compact
          ? "flex flex-col"
          : "flex flex-col sm:flex-row sm:items-center sm:justify-between",
        className ?? "",
      ].join(" ")}
      aria-label="Pagination"
    >
      <div className="text-xs sm:text-sm text-muted-foreground">
        {typeof totalCount === "number" ? (
          <>
            Menampilkan{" "}
            <span className="font-medium">
              {typeof filteredCount === "number" ? filteredCount : totalCount}
            </span>{" "}
            dari <span className="font-medium">{totalCount}</span> data
            {totalPages > 0 ? (
              <>
                {" "}
                (hal. <span className="font-medium">{page}</span>/
                <span className="font-medium">{totalPages}</span>)
              </>
            ) : null}
          </>
        ) : (
          <>
            Halaman <span className="font-medium">{page}</span> dari{" "}
            <span className="font-medium">{totalPages}</span>
            {pageSize ? (
              <span className="ml-2 text-[11px] sm:text-xs">
                ({pageSize} / halaman)
              </span>
            ) : null}
          </>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onPageSizeChange && pageSize ? (
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const n = parseInt(v, 10);
              onPageSizeChange(n);
              onPageChange(1);
            }}
          >
            <SelectTrigger className="w-[120px]" aria-label="Items per page">
              <SelectValue placeholder={`${pageSize} / page`} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} / page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : null}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(clamp(page - 1, 1, totalPages || 1))}
          disabled={prevDisabled}
          aria-label="Previous page"
        >
          Prev
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={() => onPageChange(clamp(page + 1, 1, totalPages || 1))}
          disabled={nextDisabled}
          aria-label="Next page"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
