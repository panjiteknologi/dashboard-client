"use client";

import React, { Fragment } from "react";
import { Newspaper } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function NewsSkeleton({
  view = "grid",
}: {
  view?: "grid" | "list";
}) {
  return (
    <Fragment>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">
              Portal Berita PT TSI
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Update terkini seputar sertifikasi dan ISO
            </p>
          </div>
        </div>
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>

      {view === "grid" && (
        <div className="mb-6 sm:mb-8 rounded-xl overflow-hidden border">
          <Skeleton className="h-64 sm:h-80 md:h-96 w-full" />
          <div className="p-4 sm:p-6 space-y-3">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-full" />

            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>

            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>
      )}

      <div className="mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-muted rounded-full" />
        <Skeleton className="h-5 w-40" />
      </div>

      <div
        className={`grid ${
          view === "grid"
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
            : "space-y-4"
        }`}
      >
        {Array.from({ length: view === "grid" ? 6 : 4 }).map((_, i) => (
          <div
            key={i}
            className={`border rounded-lg overflow-hidden ${
              view === "list" ? "flex gap-4 p-4" : ""
            }`}
          >
            <Skeleton
              className={view === "grid" ? "h-40 w-full" : "h-24 w-32 shrink-0"}
            />

            <div className="p-4 space-y-3 w-full">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
