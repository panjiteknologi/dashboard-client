import React, { Fragment } from "react";
import { Receipt } from "lucide-react";
import { ApiResponseTypes } from "@/types/payments";
import { Badge } from "./payments-badge";
import { PaymentsPaginationInfo } from "./payments-pagination-info";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { OrderCardPayments } from "./order-card-payments";

export default function PaymentsView({ data }: { data?: ApiResponseTypes }) {
  const orders = data?.data ?? [];
  const isSuccess = data?.status === "success";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx(
              "text-xl font-bold leading-tight tracking-tight",
              THEME.headerText
            )}
          >
            Payments
          </h1>
          <p className={cx("text-sm", THEME.subText)}>
            Order &amp; invoice overview synced to your data
          </p>
        </div>
        <div className="text-xs text-slate-500">
          Status:{" "}
          <Badge variant={isSuccess ? "success" : "destructive"}>
            {data?.status}
          </Badge>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-white p-8 text-center">
          <div className="mx-auto mb-2 inline-flex rounded-2xl bg-sky-100 p-3">
            <Receipt className={cx("h-6 w-6", THEME.icon)} />
          </div>
          <div className={cx("text-base font-semibold", THEME.headerText)}>
            No orders found
          </div>
          <p className="mt-1 text-sm text-slate-600">
            Try adjusting filters or refresh your data source.
          </p>
        </div>
      ) : (
        <Fragment>
          {orders.map((o, index) => (
            <OrderCardPayments key={index} order={o} cx={cx} THEME={THEME} />
          ))}
        </Fragment>
      )}

      <PaymentsPaginationInfo meta={data?.pagination} />
    </div>
  );
}
