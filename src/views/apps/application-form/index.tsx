/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { getlatestProgress, getNextStep } from "@/utils/getProgressAndField";
import { ColumnDef } from "@tanstack/react-table";
import { AllApplicationFormType, StandardTypes } from "@/types/projects";
import ApplicationFormDetails from "./application-form-details";

export default function ApplicationFormView({
  data,
  uniqueStandards,
}: {
  data: AllApplicationFormType[];
  uniqueStandards: StandardTypes[] | any;
}) {
  const dataTransform = useMemo(() => {
    const stat = {
      surveilance1: "sv 1",
      surveilance2: "sv 2",
      surveilance3: "sv 3",
      surveilance4: "sv 4",
      surveilance5: "sv 5",
    } as const;

    return data.map((item) => ({
      ...item,
      sv: stat[item.tahapan as keyof typeof stat] ?? item.tahapan,
    }));
  }, [data]);

  const columns = useMemo<ColumnDef<AllApplicationFormType>[]>(
    () => [
      {
        header: "Company Name",
        accessorKey: "customer",
        cell: ({ row }) => (
          <p className="text-sm font-bold">
            {row.original.partner_name ?? "-"}
          </p>
        ),
      },
      {
        header: "Office Address",
        accessorKey: "office_address",
        cell: ({ row }) => (
          <p className="text-sm font-bold">
            {row.original.office_address ?? "-"}
          </p>
        ),
      },
      {
        header: "Invoice Address",
        accessorKey: "invoice_address",
        cell: ({ row }) => (
          <p className="text-sm font-bold">
            {row.original.invoice_address ?? "-"}
          </p>
        ),
      },
      {
        header: "Contact Person",
        accessorKey: "contact_person",
        cell: ({ row }) => (
          <p className="text-sm font-bold">
            {row.original.contact_person ?? "-"}
          </p>
        ),
      },
      {
        header: "Phone",
        accessorKey: "phone",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.phone ?? "-"}</p>
        ),
      },
      {
        header: "Departement",
        accessorKey: "departement",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.departement ?? "-"}</p>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: ({ row }) => (
          <p className="text-sm font-bold">{row.original.email ?? "-"}</p>
        ),
      },
      {
        header: "Website",
        accessorKey: "website",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-left italic">
            {row.original.website ?? "-"}
          </p>
        ),
      },
    ],
    []
  );

  const customGlobalFilter = (
    row: any,
    columnId: string,
    filterValue: string
  ) => {
    const filter = filterValue.toLowerCase();
    const flatString = Object.values(row.original)
      .map((val) => (Array.isArray(val) ? val.join(" ") : val ?? ""))
      .join(" ")
      .toLowerCase();

    if (columnId === "next_step") {
      const next = getNextStep(row.original);
      return next.toLowerCase().includes(filter);
    }

    if (columnId === "latest_progress") {
      const latest = getlatestProgress(row.original);
      return latest.toLowerCase().includes(filter);
    }

    return flatString.includes(filter);
  };

  return (
    <div className="space-y-6 max-w-screen">
      <DataTable
        columns={columns}
        data={dataTransform}
        uniqueStandards={uniqueStandards}
        loading={false}
        customGlobalFilter={customGlobalFilter}
        children={(rowData) => {
          return (
            <div className="p-2 pb-4">
              <ApplicationFormDetails data={rowData} />
            </div>
          );
        }}
      />
    </div>
  );
}
