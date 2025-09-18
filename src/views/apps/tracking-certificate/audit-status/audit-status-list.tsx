/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
"use client";
import React, { useMemo } from "react";
import DataTable from "@/components/ui/data-table";
import { findTahapan } from "@/utils/getNormalizeTahapan";
import { getlatestProgress, getNextStep } from "@/utils/getProgressAndField";
import TrackingProgressView from "./tracking-progress";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { AllProject, StandardTypes } from "@/types/projects";
import { cx } from "@/utils";
import { THEME } from "@/constant";

export default function AuditStatusView({
  data,
  uniqueStandards,
}: {
  data: AllProject[];
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

  const columns = useMemo<ColumnDef<AllProject>[]>(
    () => [
      {
        header: "Nama Perusahaan",
        accessorKey: "customer",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900">
            {row.original.customer ?? "-"}
          </p>
        ),
      },
      {
        header: "Nama Sales",
        accessorKey: "sales_person",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900">
            {row.original.sales_person ?? "-"}
          </p>
        ),
      },
      {
        header: "Standar",
        accessorKey: "iso_standards",
        cell: ({ row }) => {
          const standar = row.original.iso_standards;
          return Array.isArray(standar) && standar.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {standar.map((item, index) => (
                <Badge variant="outline" key={index}>
                  {item ?? "-"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
        filterFn: (row, columnId, filterValue) => {
          const values: string[] = row.getValue(columnId);
          return values?.some((v) =>
            v.toLowerCase().includes(filterValue.toLowerCase())
          );
        },
      },
      {
        header: "Akreditasi",
        accessorKey: "accreditation",
        cell: ({ row }) => {
          const accreditations = row.original.accreditation;
          return Array.isArray(accreditations) && accreditations.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {accreditations.map((item, index) => (
                <Badge variant="outline" key={index}>
                  {item ?? "-"}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        header: "Tahapan",
        accessorKey: "tahapan",
        cell: ({ row }) => {
          const normalizedField = findTahapan(row.original.tahapan as string);
          return (
            <p className="text-sm font-bold text-blue-900">
              {normalizedField?.nama_tahapan ?? "-"}
            </p>
          );
        },
      },
      {
        header: "Latest Progress",
        accessorKey: "tahapan",
        accessorFn: getlatestProgress,
        id: "latest_progress",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-green-500 text-left capitalize italic">
            {getlatestProgress(row.original)}
          </p>
        ),
      },
      {
        header: "Next Step",
        accessorKey: "next_step",
        accessorFn: getNextStep,
        id: "next_step",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-orange-600 text-left capitalize italic">
            {getNextStep(row.original)}
          </p>
        ),
      },
      {
        header: "Lead Time Project",
        accessorKey: "lead_time_finish",
        cell: ({ row }) => (
          <p className="text-sm font-bold text-blue-900 text-left capitalize italic">
            {row.original.lead_time_finish ?? "-"}
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Audit Status Tracking Certificate
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            View and manage all tracking your certifications
          </p>
        </div>
        <DataTable
          filteredStandard={false}
          isSearch={false}
          columns={columns}
          data={dataTransform}
          uniqueStandards={uniqueStandards}
          loading={false}
          customGlobalFilter={customGlobalFilter}
          children={(rowData) => {
            return (
              <div>
                <h1 className="text-md font-bold p-4">
                  Audit Status - Progress
                </h1>

                <div className="p-2 pb-4">
                  <TrackingProgressView data={rowData} />
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
