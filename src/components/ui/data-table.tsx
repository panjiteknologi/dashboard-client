/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  PaginationState,
  FilterFnOption,
  FilterFn,
  ExpandedState,
  getExpandedRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronUp } from "lucide-react";
import Pagination from "./pagination";
import { Button } from "./button";
import { Input } from "./input";
import { Combobox } from "./combobox";
import { StandardTypes } from "@/types/projects";

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];

  /** Row detail (expander) */
  expandable?: boolean; // default: true
  renderExpanded?: (x: TData) => React.ReactNode; // kalau tidak ada, pakai children fallback
  children?: (x: TData) => React.ReactNode; // kompat lama
  preserveScrollOnExpand?: boolean; // default: true

  /** UX/Filter */
  loading?: boolean;
  uniqueStandards?: StandardTypes[];
  customGlobalFilter?: FilterFnOption<TData>;
  filteredStandard?: boolean;
  isSearch?: boolean;
};

function DataTable<TData extends object>({
  columns,
  data,
  expandable = true,
  renderExpanded,
  children,
  preserveScrollOnExpand = true,
  uniqueStandards,
  customGlobalFilter,
  filteredStandard,
  isSearch,
}: DataTableProps<TData>) {
  const scrollPosition = React.useRef<number>(0);
  const [selected, setSelected] = useState("");
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  const [columnFilters, setColumnFilters] = useState<any[]>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const expanderCol: ColumnDef<TData, any> = {
    id: "expander",
    header: () => null,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        onClick={() => {
          if (preserveScrollOnExpand) {
            scrollPosition.current = window.scrollY;
          }
          row.toggleExpanded();
          if (preserveScrollOnExpand) {
            setTimeout(() => {
              window.scrollTo({
                top: scrollPosition.current,
                behavior: "auto",
              });
            }, 0);
          }
        }}
        className="text-blue-900"
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
      >
        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
      </Button>
    ),
    size: 44,
  };

  const composedColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    return expandable ? [expanderCol, ...columns] : columns;
  }, [columns, expandable]);

  const defaultGlobalFilter: FilterFn<TData> = (row, columnId, filterValue) =>
    String(row.getValue(columnId))
      .toLowerCase()
      .includes(String(filterValue ?? "").toLowerCase());

  const table = useReactTable({
    data,
    columns: composedColumns,
    state: {
      globalFilter,
      columnFilters,
      sorting,
      pagination,
      expanded,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: customGlobalFilter ?? defaultGlobalFilter,

    ...(expandable
      ? {
          getRowCanExpand: () => true,
          getExpandedRowModel: getExpandedRowModel(),
        }
      : {}),
  });

  useEffect(() => {
    if (!data?.length) return;
    const id = setInterval(() => {
      const { pageIndex } = table.getState().pagination;
      const max = table.getPageCount();
      table.setPageIndex(pageIndex + 1 < max ? pageIndex + 1 : 0);
    }, 40000);
    return () => clearInterval(id);
  }, [data, table]);

  const totalPages = table.getPageCount();

  return (
    <React.Fragment>
      <div className="mb-4">
        {!!isSearch && (
          <Input
            type="search"
            placeholder="Search data..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full md:max-w-xs rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-600"
          />
        )}

        {!!filteredStandard && (
          <Combobox
            value={selected ?? ""}
            options={uniqueStandards as any}
            onChange={(val: string) => {
              setSelected(val);
              setColumnFilters((prev) => {
                const filtered = prev.filter((f) => f.id !== "standards"); // id kolom yang benar
                if (!val) return filtered;
                return [...filtered, { id: "standards", value: val }];
              });
              table.setPageIndex(0);
            }}
            placeholderName="Standard"
          />
        )}
      </div>

      <div className="w-full overflow-auto rounded-2xl border border-gray-200 shadow-sm">
        <div className="border-b relative">
          <Table className="w-full table-auto border-collapse">
            <TableHeader className="bg-blue-900 hover:bg-blue-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-white font-bold text-sm px-4 py-3 border-b border-gray-200"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                <>
                  {table.getRowModel().rows?.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-gray-50 transition"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell
                            key={cell.id}
                            className="px-4 py-3 text-sm text-gray-800 border-b border-gray-100"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>

                      {expandable &&
                        row.getIsExpanded() &&
                        (renderExpanded || children) && (
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells()?.length}
                              className="w-full min-h-[150px] p-6 border border-gray-100 shadow-inner"
                            >
                              {(renderExpanded ?? children)!(
                                row?.original as TData
                              )}
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={composedColumns?.length}
                    className="h-24 text-center text-gray-500 italic"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination
          totalItems={table.getFilteredRowModel().rows?.length}
          page={table.getState().pagination.pageIndex + 1}
          onChangePage={(pg) => table.setPageIndex(pg - 1)}
          totalPages={totalPages}
          onChangeRowsPerPage={(rows) => table.setPageSize(rows)}
          rowsPerPage={table.getState().pagination.pageSize}
        />
      </div>
    </React.Fragment>
  );
}

const MemoizedDataTable = React.memo(DataTable) as <T extends object>(
  props: DataTableProps<T>
) => React.JSX.Element;

export default MemoizedDataTable;
