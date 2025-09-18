import { ShieldCheck } from "lucide-react";

export const roleBadge = (role?: string) => {
  if (!role) return null;
  const map: Record<string, string> = {
    lead_auditor: "bg-emerald-100 text-emerald-700",
    auditor_1: "bg-sky-100 text-sky-700",
    technical_expert: "bg-amber-100 text-amber-700",
  };
  const cls = map[role] ?? "bg-slate-100 text-slate-700";
  const label =
    role === "lead_auditor"
      ? "Lead Auditor"
      : role === "auditor_1"
      ? "Auditor"
      : role === "technical_expert"
      ? "Technical Expert"
      : role.replaceAll("_", " ");
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}
    >
      <ShieldCheck className="mr-1 h-3.5 w-3.5" />
      {label}
    </span>
  );
};

export const stateBadge = (state?: string) => {
  if (!state) return null;
  const map: Record<string, string> = {
    done: "bg-green-100 text-green-700",
    confirmed: "bg-blue-100 text-blue-700",
    draft: "bg-slate-100 text-slate-700",
  };
  const cls = map[state] ?? "bg-slate-100 text-slate-700";
  const label = state[0].toUpperCase() + state.slice(1);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
};

export const stageBadge = (stage?: string) => {
  if (!stage) return null;
  const isStage2 = /Stage-?02/i.test(stage);
  const isStage1 = /Stage-?01/i.test(stage);
  const cls = isStage2
    ? "bg-purple-100 text-purple-700"
    : isStage1
    ? "bg-indigo-100 text-indigo-700"
    : "bg-teal-100 text-teal-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {stage}
    </span>
  );
};

export const methodBadge = (m?: string) => {
  if (!m) return null;
  const cls =
    m === "onsite"
      ? "bg-rose-100 text-rose-700"
      : m === "remote"
      ? "bg-cyan-100 text-cyan-700"
      : "bg-amber-100 text-amber-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}
    >
      {m}
    </span>
  );
};
