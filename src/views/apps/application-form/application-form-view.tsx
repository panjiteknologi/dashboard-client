/* eslint-disable react/no-children-prop */
"use client";

import React, { useMemo, useEffect, useState } from "react";
import DataTable from "@/components/ui/data-table";
import { ColumnDef, type FilterFn } from "@tanstack/react-table";
import { RowApplicationFormType } from "@/types/projects";
import { ApplicationFormDetail } from "./application-form-detail";
import { useISODetailQuery } from "@/hooks/use-data-iso";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { FileText } from "lucide-react";
import { ApplicationFormSkeleton } from "./application-form-skeleton";
import { RowDetailSkeleton } from "./row-detail-skeleton";

type LocalRowData = RowApplicationFormType & { id?: number };
type TableRow = { rowData: LocalRowData; index: number };

export default function ApplicationFormView({
  data,
  isLoading = false,
  emptyDelayMs = 600,
}: {
  data: RowApplicationFormType[];
  isLoading?: boolean;
  emptyDelayMs?: number;
}) {
  const tableRows = useMemo(
    () => (data ?? []).map((r, i) => ({ rowData: r, index: i })),
    [data]
  );

  const isEmpty = tableRows.length === 0;
  const [showEmpty, setShowEmpty] = useState(false);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout> | undefined;

    if (!isLoading && isEmpty) {
      t = setTimeout(() => setShowEmpty(true), emptyDelayMs);
    } else {
      setShowEmpty(false);
    }

    return () => {
      if (t) clearTimeout(t);
    };
  }, [isLoading, isEmpty, emptyDelayMs]);

  const formatDate = (iso?: string) => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const badgeClass = (v?: string) => {
    const s = (v ?? "").toLowerCase();
    if (
      [
        "approved",
        "verify head",
        "done",
        "client_approval",
        "cliennt_approval",
      ].includes(s)
    )
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (
      [
        "waiting verify",
        "waiting_verify",
        "draft",
        "new quotation",
        "new_quotation",
        "application review",
        "aplication review",
        "application_review",
      ].includes(s)
    )
      return "bg-gray-100 text-gray-700 border-gray-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const columns = useMemo<ColumnDef<TableRow>[]>(
    () => [
      {
        id: "document_no",
        header: "Document No",
        accessorFn: (r) => r.rowData.document_no,
        cell: ({ row }) => (
          <p className="text-sm font-bold">
            {row.original.rowData.document_no || "-"}
          </p>
        ),
      },
      {
        id: "customer_name",
        header: "Company Name",
        accessorFn: (r) => r.rowData.customer_name,
        cell: ({ row }) => (
          <p className="text-sm">{row.original.rowData.customer_name}</p>
        ),
      },
      {
        id: "issued_date",
        header: "Issued Date",
        accessorFn: (r) => r.rowData.issued_date,
        cell: ({ row }) => (
          <p className="text-sm">
            {formatDate(row.original.rowData.issued_date)}
          </p>
        ),
      },
      {
        id: "standards",
        header: "Standards",
        accessorFn: (r) => r.rowData.standards?.join(", ") ?? "",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {(row.original.rowData.standards ?? []).map((std, i) => (
              <span
                key={`${std}-${i}`}
                className="text-xs px-2 py-1 border rounded-full bg-gray-100"
              >
                {std}
              </span>
            ))}
          </div>
        ),
        enableGlobalFilter: false,
      },
      {
        id: "created_by",
        header: "Created By",
        accessorFn: (r) => r.rowData.created_by,
        cell: ({ row }) => (
          <p className="text-sm">{row.original.rowData.created_by}</p>
        ),
      },
      {
        id: "status_app_form",
        header: "Status App Form",
        accessorFn: (r) => r.rowData.status_app_form,
        cell: ({ row }) => (
          <span
            className={`text-xs px-2 py-1 border rounded-full font-semibold uppercase ${badgeClass(
              row.original.rowData.status_app_form
            )}`}
          >
            {row.original.rowData.status_app_form || "-"}
          </span>
        ),
      },
      {
        id: "status_sales",
        header: "Status Sales",
        accessorFn: (r) => r.rowData.status_sales,
        cell: ({ row }) => (
          <span
            className={`text-xs px-2 py-1 border rounded-full font-semibold uppercase ${badgeClass(
              row.original.rowData.status_sales
            )}`}
          >
            {row.original.rowData.status_sales || "-"}
          </span>
        ),
      },
      {
        id: "audit_status",
        header: "Audit Status",
        accessorFn: (r) => r.rowData.audit_status,
        cell: ({ row }) => (
          <p className="text-sm">{row.original.rowData.audit_status || "-"}</p>
        ),
      },
    ],
    []
  );

  const customGlobalFilter: FilterFn<TableRow> = (
    row,
    _columnId,
    filterValue
  ) => {
    const needle = String(filterValue ?? "")
      .toLowerCase()
      .trim();
    if (!needle) return true;
    const r = row.original.rowData;
    const haystack = [
      r.document_no,
      r.customer_name,
      formatDate(r.issued_date),
      (r.standards ?? []).join(" "),
      r.created_by,
      r.status_app_form,
      r.status_sales,
      r.audit_status,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  };

  const RowDetail: React.FC<{ row: LocalRowData }> = ({ row }) => {
    const id = row.id;
    const {
      data: detailRes,
      isLoading: isDetailLoading,
      isError,
    } = useISODetailQuery(id, Boolean(id));
    const detail = detailRes?.data;

    const merged = {
      ...row,
      id: row.id,
      customer_name: detail?.customer?.name ?? row.customer_name,
      issued_date: detail?.issued_date ?? row.issued_date,
      standards:
        (detail?.iso_standard_ids ?? [])
          .map((s: { name?: string }) => s?.name)
          .filter(Boolean) || row.standards,
      audit_stage: detail?.audit_stage,
      certification: detail?.certification,
      office_address: detail?.office_address,
      contact_person: detail?.contact_person,
      email: detail?.email,
      website: detail?.website,
      scope: detail?.scope,
      boundaries: detail?.boundaries,
      integrated_audit: detail?.integrated_audit ?? detail?.integreted_audit,
      available_sections: detail?.available_sections as string[] | undefined,
    };

    if (isDetailLoading) return <RowDetailSkeleton />;
    if (isError || !detail)
      return (
        <div className="rounded-md border p-3 text-sm text-red-600">
          Gagal memuat detail.
        </div>
      );

    return (
      <div className="p-2 pb-4">
        <ApplicationFormDetail data={merged} />
      </div>
    );
  };

  if (isLoading || (isEmpty && !showEmpty)) {
    return <ApplicationFormSkeleton />;
  }

  if (isEmpty && showEmpty) {
    return (
      <div className="space-y-4">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Application Form
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Manage your certification requests and application details with ease
          </p>
        </div>

        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-10 text-center">
          <div className="mx-auto mb-3 inline-flex rounded-2xl bg-sky-100 p-3">
            <FileText className="h-6 w-6 text-sky-700" />
          </div>
          <div className="text-base font-semibold text-sky-800">No data</div>
          <p className="mt-1 text-sm text-slate-600">
            Belum ada Application Form yang bisa ditampilkan.
          </p>
        </div>
      </div>
    );
  }

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
            Application Form
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Manage your certification requests and application details with ease
          </p>
        </div>

        <DataTable
          columns={columns}
          data={tableRows}
          loading={false}
          filteredStandard={false}
          customGlobalFilter={customGlobalFilter}
          children={({
            rowData,
            index,
          }: {
            rowData: LocalRowData;
            index: number;
          }) => (
            <RowDetail
              key={`${rowData.document_no ?? "row"}-${index}`}
              row={rowData}
            />
          )}
        />
      </div>
    </div>
  );
}
