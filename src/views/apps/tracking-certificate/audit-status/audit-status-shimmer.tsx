import { ShimmerBar, TableSkeleton } from "./table-skeleton";

export const AuditStatusShimmer = () => {
  return (
    <div className="space-y-4">
      <div>
        <ShimmerBar className="h-6 w-64" />
        <ShimmerBar className="mt-2 h-4 w-80" />
      </div>
      <TableSkeleton rows={8} cols={7} />
    </div>
  );
};
