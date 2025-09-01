/* eslint-disable react/no-children-prop */
"use client";
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { ColumnDef, type FilterFn } from "@tanstack/react-table";
import { PlanTypes, StandardTypes } from "@/types/projects";
import { AuditPlanDetail } from "./audit-plan-detail";

export default function AuditPlanView({
  data,
  uniqueStandards,
}: {
  data: PlanTypes[];
  uniqueStandards: StandardTypes[];
}) {
  const filteredData = useMemo(
    () => data.filter((item) => item?.category === "report"),
    [data]
  );

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
            className={`text-sm font-semibold ${
              row.original.status === "Done"
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {row.original.status ?? "-"}
          </span>
        ),
      },
    ],
    []
  );

  const customGlobalFilter: FilterFn<PlanTypes> = (
    row,
    _columnId,
    filterValue
  ) => {
    const filter = String(filterValue ?? "").toLowerCase();

    const original = row.original as unknown as Record<string, unknown>;
    const flatString = Object.values(original)
      .map((val) => {
        if (Array.isArray(val)) return val.join(" ");
        if (val == null) return "";
        if (typeof val === "object") return "";
        return String(val);
      })
      .join(" ")
      .toLowerCase();

    return flatString.includes(filter);
  };

  return (
    <div className="space-y-6 max-w-screen">
      <DataTable
        columns={columns}
        data={filteredData}
        uniqueStandards={uniqueStandards}
        loading={false}
        filteredStandard
        customGlobalFilter={customGlobalFilter} // now correctly typed
        children={(rowData) => {
          return (
            <div className="p-2 pb-4">
              <AuditPlanDetail data={rowData} />
            </div>
          );
        }}
      />
    </div>
  );
}
