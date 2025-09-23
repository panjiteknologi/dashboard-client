/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { ColumnDef, type FilterFn } from "@tanstack/react-table";
import { PlanTypes } from "@/types/projects";
import { useAuditPlanContext } from "@/context/audit-plan-context";
import { cx } from "@/utils";
import { THEME } from "@/constant";
import { AuditPlanSkeleton } from "./audit-plan-skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export const AuditPlanView = () => {
  const { filteredPaged, uniqueStandards, isFetching, isLoading, refetch } =
    useAuditPlanContext();

  const columns = useMemo<ColumnDef<PlanTypes>[]>(
    () => [
      {
        header: "Document No",
        accessorKey: "document_no",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.document_no ?? "-"}</p>
        ),
      },
      {
        header: "Reference",
        accessorKey: "reference",
        cell: ({ row }) => (
          <p className="text-sm">{row.original.reference ?? "-"}</p>
        ),
      },
      {
        header: "Company Name",
        accessorKey: "customer",
        cell: ({ row }) => (
          <p className="text-sm">{row.original.customer ?? "-"}</p>
        ),
      },
      {
        header: "Standards",
        accessorKey: "standards",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.standards || []).map((std: string, i: number) => (
              <span
                key={i}
                className="text-xs px-2 py-1 border rounded-full bg-gray-100"
              >
                {std}
              </span>
            ))}
          </div>
        ),
      },
      {
        header: "Audit Stage",
        accessorKey: "audit_stage",
        cell: ({ row }) => (
          <p className="text-sm">{row.original.audit_stage ?? "-"}</p>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: ({ row }) => (
          <span
            className={cx(
              "text-sm font-semibold",
              row.original.status === "Done"
                ? "text-green-600"
                : "text-gray-500"
            )}
          >
            {row.original.status ?? "-"}
          </span>
        ),
      },
    ],
    []
  );

  const customGlobalFilter: FilterFn<PlanTypes> = (row, _col, filterValue) => {
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
            Audit Plan
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Perencanaan audit, perubahan program, dan status sertifikat
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
        <AuditPlanSkeleton />
      ) : (
        <div className="mt-4">
          <DataTable
            columns={columns}
            data={filteredPaged}
            uniqueStandards={uniqueStandards as any}
            loading={isLoading}
            filteredStandard={false}
            expandable={false}
            customGlobalFilter={customGlobalFilter}
          />
        </div>
      )}
    </div>
  );
};
