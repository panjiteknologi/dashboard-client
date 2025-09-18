import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const AuditPlanSkeleton = () => {
  return (
    <div className="space-y-4 max-w-screen">
      <div className="rounded-xl border border-sky-200 bg-white overflow-hidden">
        <div className="grid grid-cols-7 gap-0 bg-blue-200 p-3">
          {[
            "Document No",
            "Reference",
            "Company Name",
            "Standards",
            "Audit Stage",
            "Status",
          ].map((k) => (
            <Skeleton key={k} className="h-4 w-28" />
          ))}
        </div>
        <div className="divide-y">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="grid grid-cols-6 gap-0 p-3 items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-48" />
              <div className="flex flex-wrap gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
