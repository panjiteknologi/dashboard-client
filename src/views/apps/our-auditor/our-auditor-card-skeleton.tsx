"use client";

import { cx } from "@/utils";

const Shimmer = ({ className = "" }: { className?: string }) => {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-md bg-slate-200",
        className
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0 -translate-x-full",
          "bg-gradient-to-r from-transparent via-white/60 to-transparent",
          "animate-[shimmer_1.6s_linear_infinite]"
        )}
      />
    </div>
  );
};

export const OurAuditorCardSkeleton = ({
  projectRows = 2,
}: {
  projectRows?: number;
}) => {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Shimmer className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-40" />
            <Shimmer className="h-3 w-56" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shimmer className="h-6 w-16 rounded-full" />
          <Shimmer className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Shimmer className="h-5 w-20 rounded-full" />
        <Shimmer className="h-5 w-16 rounded-full" />
        <Shimmer className="h-5 w-24 rounded-full" />
      </div>

      <div className="my-4 h-px bg-slate-100" />

      <div className="space-y-3">
        {Array.from({ length: projectRows }).map((_, i) => (
          <div key={i} className="grid gap-3 md:grid-cols-12 md:items-start">
            <div className="md:col-span-6 space-y-2">
              <Shimmer className="h-4 w-44" />
              <Shimmer className="h-3 w-64" />
              <div className="flex flex-wrap gap-2">
                <Shimmer className="h-5 w-16 rounded-full" />
                <Shimmer className="h-5 w-20 rounded-full" />
                <Shimmer className="h-5 w-14 rounded-full" />
              </div>
            </div>

            <div className="md:col-span-6 space-y-2 md:justify-self-end">
              <div className="flex flex-wrap gap-2 md:justify-end">
                <Shimmer className="h-6 w-20 rounded-full" />
                <Shimmer className="h-6 w-24 rounded-full" />
                <Shimmer className="h-6 w-28 rounded-full" />
              </div>
              <div className="md:text-right">
                <Shimmer className="mt-1 h-3 w-36 inline-block" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
