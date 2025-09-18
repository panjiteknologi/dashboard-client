/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderTypes } from "@/types/payments";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  Receipt,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Badge,
  InvoiceStatusBadge,
  PaymentStateBadge,
  PostStateBadge,
} from "./quotations-badge";
import { formatDateID, formatIDRFraction } from "@/utils";

export const OrderCardQuotations: React.FC<{
  order: OrderTypes & Record<string, any>;
  cx: any;
  THEME: any;
}> = ({ order, cx, THEME }) => {
  const [open, setOpen] = useState(true);

  const displayName =
    order?.order_name ?? order?.quotation_name ?? order?.name ?? "-";

  const displayDate =
    order?.order_date ??
    order?.creation_quotation_sales ??
    order?.creation_date ??
    null;

  const displaySalesperson = order?.salesperson ?? order?.sales_person ?? "-";

  const totalAmount =
    order?.total_amount ?? order?.total ?? order?.amount_total ?? 0;

  const amountPaid = order?.amount_paid ?? order?.paid ?? 0;

  const amountRemaining =
    order?.amount_remaining ??
    (typeof totalAmount === "number" && typeof amountPaid === "number"
      ? totalAmount - amountPaid
      : 0);

  const overpaid = (amountRemaining ?? 0) < 0;
  const dueZero = (amountRemaining ?? 0) === 0;

  const invoices = Array.isArray(order?.invoices) ? order.invoices : [];
  const orderLines = Array.isArray(order?.order_lines) ? order.order_lines : [];

  const hasInvoices = invoices.length > 0;
  const hasOrderLines = orderLines.length > 0;

  return (
    <div
      className={cx(
        "rounded-2xl border shadow-sm transition focus-within:ring-2 focus-within:ring-sky-300",
        THEME.cardBorder,
        THEME.cardBg
      )}
    >
      <button
        onClick={() => setOpen((s) => !s)}
        className={cx(
          "w-full flex items-center justify-between gap-3 p-4 text-left",
          "hover:bg-sky-50/50 rounded-t-2xl"
        )}
        aria-expanded={open}
      >
        <div className="flex items-center gap-3">
          <div className={cx("rounded-xl p-2", THEME.headerChipBg)}>
            <Receipt className={cx("h-5 w-5", THEME.icon)} />
          </div>
          <div>
            <div className={cx("text-xs font-medium", THEME.subText)}>
              {order?.quotation_id ? "Quotation" : "Order"}
            </div>
            <div className={cx("text-lg font-semibold", THEME.headerText)}>
              {displayName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {order?.invoice_status && (
            <InvoiceStatusBadge status={order.invoice_status} />
          )}
          {order?.payment_state && (
            <PaymentStateBadge state={order.payment_state} />
          )}
          {order?.state && <PostStateBadge state={order.state} />}
          {order?.status && (
            <Badge variant="default" className="ml-1">
              {order.status}
            </Badge>
          )}
          {open ? (
            <ChevronUp className={cx("h-5 w-5", THEME.icon)} />
          ) : (
            <ChevronDown className={cx("h-5 w-5", THEME.icon)} />
          )}
        </div>
      </button>

      <div
        className={cx(
          "grid grid-cols-1 gap-4 border-t p-4 md:grid-cols-4",
          THEME.sectionBorder
        )}
      >
        <div>
          <div className={cx("text-xs", THEME.subText)}>
            {order?.quotation_id ? "Quotation Date" : "Order Date"}
          </div>
          <div className={cx("text-sm font-medium", THEME.headerText)}>
            {formatDateID(displayDate)}
          </div>
        </div>

        <div>
          <div className={cx("text-xs", THEME.subText)}>Salesperson</div>
          <div className={cx("text-sm font-medium", THEME.headerText)}>
            {displaySalesperson}
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Wallet className={cx("mt-0.5 h-4 w-4", THEME.icon)} />
          <div>
            <div className={cx("text-xs", THEME.subText)}>Total</div>
            <div className="text-sm font-semibold">
              {formatIDRFraction(totalAmount)}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <FileText className={cx("mt-0.5 h-4 w-4", THEME.icon)} />
          <div className="space-y-1">
            <div className={cx("text-xs", THEME.subText)}>Paid</div>
            <div className="text-sm font-semibold">
              {formatIDRFraction(amountPaid)}
            </div>
            <div className={cx("text-xs", THEME.subText)}>Remaining</div>
            <div
              className={cx(
                "text-sm font-semibold",
                overpaid && "text-emerald-700",
                dueZero && "text-slate-700",
                !overpaid && !dueZero && "text-red-700"
              )}
            >
              {formatIDRFraction(amountRemaining)}
            </div>
            {overpaid && (
              <Badge variant="success" className="mt-1">
                Overpaid {formatIDRFraction(Math.abs(amountRemaining))}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="border-t border-sky-100 p-4">
          {hasInvoices ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className={cx("text-sm font-semibold", THEME.headerText)}>
                  Invoices
                </h3>
                <div className={cx("text-xs", THEME.subText)}>
                  {invoices.length} document(s)
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr
                      className={cx(
                        "border-b text-slate-700",
                        THEME.tableHeadBg
                      )}
                    >
                      <th className="px-3 py-2 font-medium">Invoice</th>
                      <th className="px-3 py-2 font-medium">Date</th>
                      <th className="px-3 py-2 font-medium">Amount</th>
                      <th className="px-3 py-2 font-medium">Payment</th>
                      <th className="px-3 py-2 font-medium">State</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoices ?? []).map((inv: any) => (
                      <tr
                        key={inv.invoice_id}
                        className="border-b last:border-b-0 hover:bg-sky-50/40"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-900">
                          {inv.invoice_name}
                        </td>
                        <td className="px-3 py-2 text-slate-700">
                          {formatDateID(inv.invoice_date)}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {formatIDRFraction(inv.amount_total)}
                        </td>
                        <td className="px-3 py-2">
                          {inv.payment_state && (
                            <PaymentStateBadge state={inv.payment_state} />
                          )}
                        </td>
                        <td className="px-3 py-2">
                          {inv.state && <PostStateBadge state={inv.state} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : hasOrderLines ? (
            <>
              <div className="mb-3 flex items-center justify-between">
                <h3 className={cx("text-sm font-semibold", THEME.headerText)}>
                  Product
                </h3>
                <div className={cx("text-xs", THEME.subText)}>
                  {orderLines.length} item(s)
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-sky-100">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr
                      className={cx(
                        "border-b text-slate-700",
                        THEME.tableHeadBg
                      )}
                    >
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 font-medium">Qty</th>
                      <th className="px-3 py-2 font-medium">Unit Price</th>
                      <th className="px-3 py-2 font-medium">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(orderLines ?? []).map((line: any, idx: number) => (
                      <tr
                        key={`${line.product_name}-${idx}`}
                        className="border-b last:border-b-0 hover:bg-sky-50/40"
                      >
                        <td className="px-3 py-2 font-semibold text-slate-900">
                          {line.product_name}
                        </td>
                        <td className="px-3 py-2">{line.quantity}</td>
                        <td className="px-3 py-2 font-medium">
                          {formatIDRFraction(line.unit_price)}
                        </td>
                        <td className="px-3 py-2 font-medium">
                          {formatIDRFraction(line.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className={cx("text-xs", THEME.subText)}>No data.</div>
          )}

          <div className="mt-2 text-[11px] text-slate-500">
            Tip: click row highlight to scan faster.
          </div>
        </div>
      )}
    </div>
  );
};
