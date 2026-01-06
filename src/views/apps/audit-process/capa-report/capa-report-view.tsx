'use client';

/* eslint-disable react/no-children-prop */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { CapaTypes, StandardTypes } from "@/types/projects";
import { CapaReportDetail } from "./capa-report-detail";

export const CapaReportView = ({
  data,
  uniqueStandards,
  loading,
}: {
  data: CapaTypes[];
  uniqueStandards: StandardTypes[] | any;
  loading: boolean;
}) => {

  // console.log('data',data)
  const columns = useMemo<ColumnDef<CapaTypes>[]>(
    () => [
      {
        header: "Document No",
        accessorKey: "document_no",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.document_no ?? "-"}</p>
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
        header: "Reference",
        accessorKey: "reference",
        cell: ({ row }) => (
          <p className="text-sm">{row.original.reference ?? "-"}</p>
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

  const customGlobalFilter = (row: any, filterValue: string) => {
    const filter = filterValue.toLowerCase();
    const flatString = Object.values(row.original)
      .map((val) => (Array.isArray(val) ? val.join(" ") : val ?? ""))
      .join(" ")
      .toLowerCase();

    return flatString.includes(filter);
  };

  return (
    <div className="space-y-6 max-w-screen">
      <DataTable
        columns={columns}
        data={data}
        uniqueStandards={uniqueStandards}
        loading={loading}
        // filteredStandard
        expandOnRowClick
        customGlobalFilter={customGlobalFilter}
        children={(rowData) => {
          return (
            <div className="p-2 pb-4">
              <CapaReportDetail data={rowData} />
            </div>
          );
        }}
      />
    </div>
  );
};
