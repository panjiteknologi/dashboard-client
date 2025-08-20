"use client";

import React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  page: number; // page dimulai dari 1
  onChangePage: (page: number) => void;
  totalPages: number;
  totalItems: number;
  onChangeRowsPerPage: (rowsPerPage: number) => void;
  rowsPerPage: number;
};

export default function Pagination({
  page,
  onChangePage,
  totalPages,
  totalItems,
  onChangeRowsPerPage,
  rowsPerPage,
}: Props) {
  const handleRowsPerPageChange = (value: string) => {
    const newSize = Number(value);
    onChangeRowsPerPage(newSize);
    onChangePage(1); // reset ke halaman 1
  };

  const handleChangePage = (target: number) => {
    if (target >= 1 && target <= totalPages) {
      onChangePage(target);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between gap-4 px-4 py-2 sm:flex-row">
      <div className="text-sm font-medium text-muted-foreground">
        Showing {rowsPerPage * (page - 1) + 1} -{" "}
        {Math.min(rowsPerPage * page, totalItems)} of{" "}
        {totalItems.toLocaleString()} rows
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 md:flex">
          <Label
            htmlFor="rows-per-page"
            className="text-sm text-muted-foreground font-medium"
          >
            Rows per page
          </Label>
          <Select
            value={`${rowsPerPage}`}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="w-20" id="rows-per-page">
              <SelectValue placeholder={`${rowsPerPage}`} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(1)}
            disabled={page <= 1}
          >
            <ChevronsLeftIcon size={16} />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeftIcon size={16} />
          </Button>
          <span className="text-sm font-medium">{page}</span>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRightIcon size={16} />
          </Button>
          <Button
            variant="outline"
            className="h-8 w-8 p-0"
            onClick={() => handleChangePage(totalPages)}
            disabled={page >= totalPages}
          >
            <ChevronsRightIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
