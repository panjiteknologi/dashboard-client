import moment from "moment";

type DateLike = string | number | Date | null | undefined;

export function formatDateTime(value: string) {
  return value ? moment(value)?.format("DD MMMM YYYY HH:mm:ss") : "-";
}

const parseToDate = (d: DateLike): Date | null => {
  if (d == null) return null;

  if (d instanceof Date) {
    return Number.isNaN(+d) ? null : d;
  }

  if (typeof d === "number") {
    const dt = new Date(d);
    return Number.isNaN(+dt) ? null : dt;
  }

  if (typeof d === "string") {
    const s = d.trim();
    if (!s) return null;

    // 1) "YYYY-MM-DD" atau "YYYY-MM-DD HH:mm" / "YYYY-MM-DD HH:mm:ss"
    const m = s.match(
      /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (m) {
      const [, y, mo, da, hh = "00", mm = "00", ss = "00"] = m;
      const dt = new Date(
        Number(y),
        Number(mo) - 1,
        Number(da),
        Number(hh),
        Number(mm),
        Number(ss)
      );
      return Number.isNaN(+dt) ? null : dt;
    }

    // 2) Fallback ke Date.parse untuk format lain yang valid (ISO, dll)
    const t = Date.parse(s);
    if (!Number.isNaN(t)) return new Date(t);

    return null;
  }

  return null;
};

export const formatDateID = (d: DateLike, fallback = "-") => {
  const dt = parseToDate(d);
  if (!dt) return fallback;

  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "2-digit",
    }).format(dt);
  } catch {
    return fallback;
  }
};

export const formatDateShortID = (s?: string | null) => {
  if (!s) return "-";
  const d = new Date(s);
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export const formatDateTimeID = (d: DateLike, fallback = "-") => {
  const dt = parseToDate(d);
  if (!dt) return fallback;

  try {
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(dt);
  } catch {
    return fallback;
  }
};

export const formatDateRangeID = (start?: string, end?: string) => {
  if (!start && !end) return "-";
  if (start && end) return `${formatDateID(start)} — ${formatDateID(end)}`;
  return formatDateID(start || end!);
};

export const clampMonth = (m: string) =>
  /^\d{4}-\d{2}$/.test(m) ? m : new Date().toISOString().slice(0, 7);

export const fmtYear = (d: Date) => String(d.getFullYear());
export const fmtMonth = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
export const fmtDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;

export const parseMonth = (m: string) => {
  const [y, mm] = m.split("-").map(Number);
  return new Date(y, (mm || 1) - 1, 1);
};

export const monthDiff = (a: string, b: string) => {
  const d1 = parseMonth(a);
  const d2 = parseMonth(b);
  return (
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth())
  );
};

export const rangeMonths = (from: string, to: string) => {
  const n = Math.max(0, monthDiff(from, to));
  const out: string[] = [];
  const d = parseMonth(from);
  for (let i = 0; i <= n; i++) {
    out.push(fmtMonth(d));
    d.setMonth(d.getMonth() + 1);
  }
  return out;
};
