/* eslint-disable react/no-children-prop */
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { ColumnDef, type FilterFn } from "@tanstack/react-table";
import { cx } from "@/utils";
import { THEME } from "@/constant";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { HistoryTypes } from "@/types/audit-history";
import { AuditHistorySkeleton } from "./audit-history-skeleton";
import { useAuditHistoryContext } from "@/context/audit-history-context";
import { AuditHistoryDetail } from "./audit-history-detail";

export const AuditHistoryView = () => {
  const { filteredPaged, isFetching, isLoading, refetch } =
    useAuditHistoryContext();

  const columns = useMemo<ColumnDef<HistoryTypes>[]>(
    () => [
      {
        header: "Record",
        accessorKey: "record_name",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.record_name}</p>
        ),
      },
      {
        header: "Model",
        accessorKey: "model",
        cell: ({ row }) => <p className="text-sm">{row.original.model}</p>,
      },
      {
        header: "Author",
        accessorKey: "author",
        cell: ({ row }) => <p className="text-sm">{row.original.author}</p>,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: ({ row }) => (
          <p className="text-sm">
            {new Date(row.original.date).toLocaleString("id-ID")}
          </p>
        ),
      },
    ],
    []
  );

  const customGlobalFilter: FilterFn<HistoryTypes> = (
    row,
    _col,
    filterValue
  ) => {
    const filter = String(filterValue ?? "").toLowerCase();
    const original = row.original as unknown as Record<string, unknown>;
    const flat = Object.values(original)
      .map((v) =>
        Array.isArray(v)
          ? v.join(" ")
          : v == null
          ? ""
          : typeof v === "object"
          ? ""
          : String(v)
      )
      .join(" ")
      .toLowerCase();
    return flat.includes(filter);
  };

  return (
    <div className="space-y-4 max-w-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={cx("text-xl font-bold", THEME.headerText)}>
            Audit History
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Riwayat audit, perubahan program, plan, dan sertifikat
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          aria-label="Refresh"
          onClick={() => refetch?.()}
          disabled={isFetching}
          title="Refresh data"
        >
          <RefreshCw
            className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {isLoading || isFetching ? (
        <AuditHistorySkeleton />
      ) : (
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredPaged}
            loading={isLoading}
            filteredStandard={false}
            customGlobalFilter={customGlobalFilter}
            children={(rowData) => {
              return (
                <div className="p-2 pb-4">
                  <AuditHistoryDetail data={rowData} />
                </div>
              );
            }}
          />
        </div>
      )}
    </div>
  );
};
