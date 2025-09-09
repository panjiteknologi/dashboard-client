/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getExpandedRowModel,
  getCoreRowModel,
  ColumnDef,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  PaginationState,
  FilterFnOption,
  FilterFn,
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

type Pagination = {
  pageIndex: number;
  pageSize: number;
  totalData: number;
};

type DataTableProps<TData extends object> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  children?: (x: TData) => React.ReactNode;
  loading?: boolean;
  uniqueStandards?: StandardTypes[];
  customGlobalFilter?: FilterFnOption<TData>;
  filteredStandard?: boolean;
  isSearch?: boolean;
};

function DataTable<TData extends object>({
  columns,
  data,
  children,
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

  const perPage = 10;
  const totalPages = Math.ceil(data?.length / perPage);

  const additionalColumn = React.useMemo(() => {
    return [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => {
                scrollPosition.current = window.scrollY; // simpan posisi scroll
                row.toggleExpanded();
                setTimeout(() => {
                  window.scrollTo({
                    top: scrollPosition.current,
                    behavior: "auto",
                  });
                }, 0);
              }}
              className="text-blue-900"
            >
              {row.getIsExpanded() ? <ChevronDown /> : <ChevronUp />}
            </Button>
          );
        },
      },
      ...columns,
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const defaultGlobalFilter: FilterFn<TData> = (row, columnId, filterValue) => {
    return String(row.getValue(columnId))
      .toLowerCase()
      .includes(filterValue.toLowerCase());
  };

  const table = useReactTable({
    data: data,
    columns: additionalColumn,
    state: {
      globalFilter,
      columnFilters,
      sorting,
    },
    onSortingChange: setSorting,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: customGlobalFilter ?? defaultGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  useEffect(() => {
    const dataLength = data.length;
    const intervalId = setInterval(() => {
      const { pageSize, pageIndex } = table.getState().pagination;
      const maxPage = Math.floor(dataLength / pageSize);
      table.setPageIndex(pageIndex < maxPage - 1 ? pageIndex + 1 : 0);
    }, 40000);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <React.Fragment>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        {!!isSearch && (
          <Input
            type="search"
            placeholder="Search data..."
            value={globalFilter ?? ""}
            onChange={(e) => {
              setGlobalFilter(e.target.value);
            }}
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
                const filtered = prev.filter((f) => f.id !== "iso_standards");
                if (!val) return filtered;
                return [...filtered, { id: "iso_standards", value: val }];
              });
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
                  {headerGroup.headers.map((header, i) => {
                    return (
                      <TableHead
                        key={i}
                        className="text-white font-bold text-sm px-4 py-3 border-b border-gray-200"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            {!!data && (
              <TableBody>
                {table?.getRowModel()?.rows?.length ? (
                  <React.Fragment>
                    {table.getRowModel().rows.map((row) => (
                      <React.Fragment key={row.id}>
                        <TableRow
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-gray-50 transition"
                        >
                          {row.getVisibleCells().map((cell, idx) => (
                            <TableCell
                              key={idx}
                              className="px-4 py-3 text-sm text-gray-800 border-b border-gray-100"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                        {row.getIsExpanded() && (
                          <TableRow>
                            <TableCell
                              colSpan={row.getVisibleCells().length}
                              className="w-full min-h-[150px] p-6 border border-gray-100 shadow-inner"
                            >
                              <div>
                                {children ? children(row.original) : null}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    ))}
                  </React.Fragment>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-gray-500 italic"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
        <Pagination
          totalItems={data?.length}
          page={pagination.pageIndex + 1}
          onChangePage={(pg) => {
            setPagination((prev) => ({ ...prev, pageIndex: pg - 1 }));
          }}
          totalPages={totalPages}
          onChangeRowsPerPage={(rows) =>
            setPagination((prev) => ({ ...prev, pageSize: rows }))
          }
          rowsPerPage={pagination.pageSize}
        />
      </div>
    </React.Fragment>
  );
}

const MemoizedDataTable = React.memo(DataTable) as <T extends object>(
  props: DataTableProps<T>
) => React.JSX.Element;

export default MemoizedDataTable;
