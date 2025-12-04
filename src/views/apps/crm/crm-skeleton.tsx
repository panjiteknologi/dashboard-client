"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  rows?: number;
};

export const CRMSkeleton = ({ rows = 6 }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">ISO Standards</TableHead>
          <TableHead className="w-[200px]">Tahapan Audit</TableHead>
          <TableHead className="w-[200px]">Level</TableHead>
          <TableHead className="w-[200px]">Sales</TableHead>
          <TableHead className="w-[200px] text-right">Nilai Kontrak</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow
            key={i}
            className="transition-colors hover:bg-muted/50 animate-pulse"
          >
            <TableCell>
              <Skeleton className="h-4 w-3/4" />
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
                <Skeleton className="h-4 w-24" />
              </span>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-16" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-24 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
