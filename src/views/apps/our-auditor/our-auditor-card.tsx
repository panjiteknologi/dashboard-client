import { formatDateRangeID } from "@/utils";
import { useState } from "react";
import {
  methodBadge,
  roleBadge,
  stageBadge,
  stateBadge,
} from "./our-auditor-badge";
import { OurAuditor } from "@/types/our-auditor";

export const OurAuditorCard = ({ auditor }: { auditor: OurAuditor }) => {
  const [open, setOpen] = useState(true);
  const projects = auditor?.projects ?? [];

  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <button
        onClick={() => setOpen((s) => !s)}
        className="flex w-full items-center justify-between gap-3 rounded-t-2xl p-4 text-left hover:bg-sky-50/60"
        aria-expanded={open}
      >
        <div>
          <div className="text-xs font-medium text-slate-500">Auditor</div>
          <div className="text-lg font-semibold text-slate-900">
            {auditor?.name}
          </div>
        </div>
        <div className="text-xs text-slate-500">
          {projects?.length} project(s)
        </div>
      </button>

      {open && (
        <div className="border-t p-4">
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b text-slate-700">
                  <th className="px-3 py-2 font-medium">Document</th>
                  <th className="px-3 py-2 font-medium">Customer</th>
                  <th className="px-3 py-2 font-medium">ISO</th>
                  <th className="px-3 py-2 font-medium">Stage</th>
                  <th className="px-3 py-2 font-medium">Date</th>
                  <th className="px-3 py-2 font-medium">Method</th>
                  <th className="px-3 py-2 font-medium">Role</th>
                  <th className="px-3 py-2 font-medium">State</th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((p, index) => (
                  <tr
                    key={index}
                    className="border-b last:border-b-0 hover:bg-sky-50/40"
                  >
                    <td className="px-3 py-2 font-semibold text-slate-900">
                      {p?.document_no}
                    </td>
                    <td className="px-3 py-2">{p?.customer_name}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-1">
                        {(p?.iso_standards ?? []).map((s, i) => (
                          <span
                            key={`${s}-${i}`}
                            className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-2">{stageBadge(p?.audit_stage)}</td>
                    <td className="px-3 py-2">
                      {p?.audit_start || p?.audit_end ? (
                        <div className="text-slate-700">
                          {formatDateRangeID(p?.audit_start, p?.audit_end)}
                        </div>
                      ) : (
                        <div className="text-slate-700">
                          {p?.audit_date ?? "-"}
                        </div>
                      )}
                      {p?.certification_type && (
                        <div className="text-[11px] text-slate-500">
                          {p?.certification_type}
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      {methodBadge(p?.audit_method)}
                    </td>
                    <td className="px-3 py-2">{roleBadge(p?.auditor_role)}</td>
                    <td className="px-3 py-2">{stateBadge(p?.state)}</td>
                  </tr>
                ))}

                {projects.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-6 text-center text-xs text-slate-500"
                    >
                      Belum ada project.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Optional: detail kecil di bawah */}
          <div className="mt-2 text-[11px] text-slate-500">
            Tip: gunakan search & filter stage di atas untuk mempercepat
            pencarian.
          </div>
        </div>
      )}
    </div>
  );
};
