function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const Badge: React.FC<{
  variant?:
    | "default"
    | "outline"
    | "success"
    | "warning"
    | "destructive"
    | "muted";
  children: React.ReactNode;
  className?: string;
}> = ({ variant = "default", children, className }) => {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition";
  const styles: Record<string, string> = {
    // Primary badge follows sky-800
    default: "border-transparent bg-sky-800 text-white hover:brightness-[.98]",
    outline: "border-sky-300 text-sky-800 hover:bg-sky-50 bg-white",
    success: "border-transparent bg-emerald-600 text-white hover:brightness-95",
    warning: "border-transparent bg-amber-500 text-white hover:brightness-95",
    destructive: "border-transparent bg-red-600 text-white hover:brightness-95",
    muted: "border-sky-200 text-sky-800 bg-sky-100",
  };
  return (
    <span className={cx(base, styles[variant], className)}>{children}</span>
  );
};

export function PaymentStateBadge({ state }: { state: string }) {
  const s = (state || "").toLowerCase();
  if (s === "paid" || s === "in_payment")
    return <Badge variant="success">{state}</Badge>;
  if (s === "partial" || s === "partial_paid" || s === "partially paid")
    return <Badge variant="warning">{state}</Badge>;
  return <Badge variant="destructive">{state || "Unpaid"}</Badge>;
}

export function PostStateBadge({ state }: { state: string }) {
  const s = (state || "").toLowerCase();
  if (s === "posted") return <Badge variant="muted">Posted</Badge>;
  if (s === "draft") return <Badge variant="warning">Draft</Badge>;
  return <Badge variant="outline">{state || "-"}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (s.includes("sales order"))
    return <Badge variant="muted">Sales Order</Badge>;
  if (s.includes("quotation"))
    return <Badge variant="outline">Quotation</Badge>;
  return <Badge variant="outline">{status || "-"}</Badge>;
}
