import * as React from "react";

export type SimpleMeta = {
  current_page: number;
  total_pages: number;
  total: number;
  per_page?: number;
};

export const PaginationInfo: React.FC<{ meta?: SimpleMeta }> = ({ meta }) => {
  if (!meta) return null;
  const { current_page, total_pages, total, per_page } = meta;
  return (
    <div className="rounded-xl border border-sky-200 bg-white p-3 text-xs text-slate-600">
      Showing page{" "}
      <span className="font-semibold text-sky-800">{current_page}</span> of{" "}
      <span className="font-semibold text-sky-800">{total_pages}</span> • Total
      records: <span className="font-semibold text-sky-800">{total}</span>
      {per_page ? (
        <>
          {" "}
          • <span className="font-semibold text-sky-800">{per_page}</span> /
          page
        </>
      ) : null}
    </div>
  );
};
