import { Skeleton } from "@/components/ui/skeleton";

export const OrderCardPaymentsSkeleton = () => {
  return (
    <div className="rounded-2xl border border-sky-200 bg-white shadow-sm">
      <div className="w-full flex items-center justify-between gap-3 p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl p-2 bg-sky-50">
            <Skeleton className="h-5 w-5 rounded-md" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-5 w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-5 w-5 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-sky-100 p-4 md:grid-cols-4">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Skeleton className="h-4 w-4 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      <div className="border-t border-sky-100 p-4">
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-20" />
        </div>

        <div className="overflow-x-auto rounded-xl border border-sky-100">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b bg-sky-50">
                {["Invoice", "Date", "Amount", "Payment", "State"].map((k) => (
                  <th key={k} className="px-3 py-2 font-medium">
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr
                  key={i}
                  className="border-b last:border-b-0 hover:bg-sky-50/40"
                >
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="px-3 py-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2">
          <Skeleton className="h-3 w-40" />
        </div>
      </div>
    </div>
  );
};
