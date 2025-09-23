import { Skeleton } from "@/components/ui/skeleton";

export const AuditHistorySkeleton = () => (
  <div className="space-y-4 max-w-screen">
    <div className="rounded-xl border bg-white overflow-hidden">
      <div className="grid grid-cols-5 gap-0 bg-gray-50 p-3">
        {["Record", "Model", "Author", "Date", "Changes"].map((k) => (
          <Skeleton key={k} className="h-4 w-28" />
        ))}
      </div>
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-0 p-3 items-start">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
