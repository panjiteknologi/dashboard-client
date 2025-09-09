import { Skeleton } from "@/components/ui/skeleton";
import { OrderCardPaymentsSkeleton } from "./order-card-payments-skeleton";

export function PaymentsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      <OrderCardPaymentsSkeleton />
      <OrderCardPaymentsSkeleton />
      <OrderCardPaymentsSkeleton />

      <div className="rounded-xl border border-sky-200 bg-white p-3">
        <Skeleton className="h-4 w-64" />
      </div>
    </div>
  );
}
