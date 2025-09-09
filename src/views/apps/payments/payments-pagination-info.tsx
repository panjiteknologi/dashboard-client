import { ApiResponseTypes } from "@/types/payments";

export const PaymentsPaginationInfo: React.FC<{
  meta?: ApiResponseTypes["pagination"];
}> = ({ meta }) => {
  if (!meta) return null;
  const { current_page, total_pages, total } = meta;
  return (
    <div className="rounded-xl border border-sky-200 bg-white p-3 text-xs text-slate-600">
      Showing page{" "}
      <span className="font-semibold text-sky-800">{current_page}</span> of{" "}
      <span className="font-semibold text-sky-800">{total_pages}</span> • Total
      records: <span className="font-semibold text-sky-800">{total}</span>
    </div>
  );
};
