"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  cards?: number;
  rows?: number;
};

export const AuditRequestSkeleton = ({
  cards = 6,
}: // rows = 6,
Props) => {
  return (
    <>
      <Card className="border-dashed">
        <CardContent className="p-4 space-y-3">
          <div className="flex md:hidden">
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-9 flex-1 min-w-[280px]" />
            <Skeleton className="h-9 w-[180px]" />
            <Skeleton className="h-9 w-[160px]" />
            <Skeleton className="h-9 w-[220px]" />
            <Skeleton className="h-8 w-[88px]" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-10 w-40 rounded-md" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: cards }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <div className="flex gap-2 pt-1">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* <Card className="mt-4">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="grid grid-cols-6 gap-3">
                {Array.from({ length: 6 }).map((__, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card> */}
    </>
  );
};
