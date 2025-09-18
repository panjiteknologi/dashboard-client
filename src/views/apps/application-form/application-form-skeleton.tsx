import { Skeleton } from "@/components/ui/skeleton";

export function ApplicationFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-80" />
        </div>
        <Skeleton className="h-8 w-40" />
      </div>

      <div className="rounded-xl border border-sky-200 bg-white overflow-hidden">
        <div className="grid grid-cols-7 gap-0 bg-blue-200 p-3">
          {[
            "Document No",
            "Company Name",
            "Issued Date",
            "Standards",
            "Created By",
            "Status App Form",
            "Status Sales",
          ].map((k) => (
            <Skeleton key={k} className="h-4 w-28" />
          ))}
        </div>
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="grid grid-cols-7 gap-0 p-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <div className="flex gap-1">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
