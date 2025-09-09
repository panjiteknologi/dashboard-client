import { cx } from "@/utils";

export const ShimmerBar = ({ className = "" }: { className?: string }) => {
  return (
    <div className={cx("animate-pulse rounded-md bg-slate-200", className)} />
  );
};

export const TableSkeleton = ({
  rows = 8,
  cols = 7,
}: {
  rows?: number;
  cols?: number;
}) => {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="border-b bg-slate-50 px-3 py-2">
        <ShimmerBar className="h-4 w-40" />
      </div>

      <div className="divide-y">
        {Array.from({ length: rows }).map((_, r) => (
          <div
            key={r}
            className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7"
          >
            {Array.from({ length: cols }).map((__, c) => (
              <div key={c} className="space-y-2">
                <ShimmerBar className="h-3 w-24" />
                <ShimmerBar className="h-4 w-full" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
