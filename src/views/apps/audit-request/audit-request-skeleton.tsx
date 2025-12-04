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

export const AuditRequestSkeleton = ({ rows = 6 }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[180px]">No. Sertifikat</TableHead>
          <TableHead className="w-[180px]">ISO Standards</TableHead>
          <TableHead className="w-[180px]">Stage</TableHead>
          <TableHead className="w-[180px]">Tanggal Request Audit</TableHead>
          <TableHead className="text-center w-[180px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rows }).map((_, i) => (
          <TableRow
            key={i}
            className="transition-colors hover:bg-muted/40 animate-pulse"
          >
            <TableCell>
              <Skeleton className="h-4 w-24" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-40" />
            </TableCell>
            <TableCell>
              <div className="inline-flex items-center rounded-full bg-muted px-2 py-1">
                <Skeleton className="h-4 w-20" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-28" />
            </TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
