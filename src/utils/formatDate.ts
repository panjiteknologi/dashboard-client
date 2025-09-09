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

// Opsional: kalau butuh tanggal + jam
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
