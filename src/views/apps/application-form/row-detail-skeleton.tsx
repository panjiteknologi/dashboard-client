import { Skeleton } from "@/components/ui/skeleton";

export const RowDetailSkeleton = () => {
  return (
    <div className="p-2 pb-4">
      <div className="rounded-xl border border-sky-100 bg-white p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-36" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Skeleton className="h-5 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-6 w-24 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
};
