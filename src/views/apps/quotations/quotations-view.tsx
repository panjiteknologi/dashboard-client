/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Fragment } from "react";
import { Receipt } from "lucide-react";
import { ApiResponseTypes } from "@/types/payments";
import { Badge } from "./quotations-badge";
import { OrderCardQuotations } from "./order-card-quotations";
import { QuotationsSkeleton } from "./quotations-skeleton";
import { THEME } from "@/constant";
import { cx } from "@/utils";
import { PaginationBar } from "@/components/pagination/pagination-bar";

type QuotationsViewProps = {
  data?: ApiResponseTypes;
  page: number;
  totalPages?: number;
  onPageChange: (p: number) => void;
  pageSize?: number;
  onPageSizeChange?: (n: number) => void;
  isFetching?: boolean;
};

export const QuotationsView = ({
  data,
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  isFetching,
}: QuotationsViewProps) => {
  const isLoading = !data || (data as any).status === "loading";
  if (isLoading) return <QuotationsSkeleton />;

  const orders = data?.data ?? [];
  const isSuccess = data?.status === "success";

  const meta =
    (data as any)?.pagination ?? (data as any)?.meta?.pagination ?? undefined;

  const currentPage = page ?? meta?.current_page ?? 1;
  const pages = totalPages ?? meta?.total_pages ?? 1;
  const total = meta?.total ?? orders.length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1
            className={cx("text-xl font-bold leading-tight", THEME.headerText)}
          >
            Quotations
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
          {orders.map((o, index: number) => (
            <OrderCardQuotations key={index} order={o} cx={cx} THEME={THEME} />
          ))}
        </Fragment>
      )}

      <PaginationBar
        page={currentPage}
        totalPages={pages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={[10, 25, 50, 100]}
        totalCount={total}
        disabled={isFetching}
        className="pb-2"
      />
    </div>
  );
};
