import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export type RequestStatus = "request" | "approve" | "reject";

export const RequestStatusBadge = ({
  status,
}: {
  status?: RequestStatus | null;
}) => {
  if (!status) {
    return (
      <Badge variant="secondary" className="rounded-full">
        -
      </Badge>
    );
  }

  const normalized = status.toLowerCase() as RequestStatus;

  if (normalized === "request") {
    return (
      <Badge className="rounded-full bg-blue-500 text-white font-medium">
        Request
      </Badge>
    );
  }

  if (normalized === "approve") {
    return (
      <Badge className="rounded-full bg-emerald-500 text-white font-semibold">
        Approved
      </Badge>
    );
  }

  if (normalized === "reject") {
    return (
      <Badge className="rounded-full bg-red-500 text-white font-medium">
        Rejected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="rounded-full">
      {capitalize(status)}
    </Badge>
  );
};

export type ExpiryLevel =
  | "overdue"
  | "critical"
  | "warning"
  | "attention"
  | "safe";

export const getExpiryLevel = (days?: number | null): ExpiryLevel => {
  if (days == null) return "safe";
  if (days < 0) return "overdue";
  if (days <= 7) return "critical";
  if (days <= 30) return "warning";
  if (days <= 90) return "attention";
  return "safe";
};

export const daysStatusText = (days?: number | null) => {
  if (days == null) return "-";
  if (days < 0) return `OVERDUE ${Math.abs(days)} HARI!`;
  if (days === 0) return "JATUH TEMPO HARI INI!";
  if (days <= 7) return `KRITIS! ${days} hari lagi`;
  if (days <= 30) return `PERHATIAN! ${days} hari lagi`;
  return `${days} hari lagi`;
};

export const statusBadge = (days?: number | null) => {
  const level = getExpiryLevel(days);

  if (days == null)
    return (
      <Badge variant="secondary" className="rounded-full">
        -
      </Badge>
    );

  if (level === "overdue")
    return (
      <Badge className="rounded-full bg-red-600 text-white font-bold animate-pulse">
        OVERDUE!
      </Badge>
    );

  if (level === "critical")
    return (
      <Badge className="rounded-full bg-red-500 text-white font-bold">
        KRITIS!
      </Badge>
    );

  if (level === "warning")
    return (
      <Badge className="rounded-full bg-orange-500 text-white font-semibold">
        PERHATIAN
      </Badge>
    );

  if (level === "attention")
    return (
      <Badge className="rounded-full bg-yellow-500 text-black font-medium">
        Segera
      </Badge>
    );

  return (
    <Badge variant="outline" className="rounded-full">
      Aman
    </Badge>
  );
};

export const StatusExpiryBadge = ({
  status_expiry,
}: {
  status_expiry?: {
    label: string;
    status: "expired" | "expiring_soon" | "still_valid";
  } | null;
}) => {
  if (!status_expiry) {
    return (
      <Badge variant="secondary" className="rounded-full">
        -
      </Badge>
    );
  }

  const { label, status } = status_expiry;

  if (status === "expired") {
    return (
      <Badge className="rounded-full bg-red-600 text-white font-medium">
        {label}
      </Badge>
    );
  }

  if (status === "expiring_soon") {
    return (
      <Badge className="rounded-full bg-yellow-500 text-black font-medium">
        {label}
      </Badge>
    );
  }

  if (status === "still_valid") {
    return (
      <Badge className="rounded-full bg-green-500 text-white font-medium">
        {label}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="rounded-full">
      {label}
    </Badge>
  );
};

export const StageBadge = ({ stage }: { stage?: string | null }) => {
  const txt = stage ?? "-";
  const isS1 = (stage ?? "").toLowerCase().includes("surveillance 1");
  const isS2 = (stage ?? "").toLowerCase().includes("surveillance 2");
  return (
    <Badge
      variant={isS1 ? "outline" : isS2 ? "secondary" : "outline"}
      className="rounded-full"
    >
      {txt}
    </Badge>
  );
};

export const humanize = (s: string) => {
  return s
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
};

export const ActiveFilterChips = ({
  q,
  stage,
  iso,
  onClear,
  onClearAll,
}: {
  q: string;
  stage: "all" | "s1" | "s2";
  iso: string;
  onClear: (key: "q" | "stage" | "urgency" | "iso") => void;
  onClearAll: () => void;
}) => {
  const chips: Array<{
    key: "q" | "stage" | "urgency" | "iso";
    label: string;
    value: string;
  }> = [];

  if (q) chips.push({ key: "q", label: "Search", value: q });
  if (stage !== "all")
    chips.push({
      key: "stage",
      label: "Stage",
      value: stage === "s1" ? "Surveillance 1" : "Surveillance 2",
    });
  if (iso !== "all") chips.push({ key: "iso", label: "ISO", value: iso });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Badge key={c.key} variant="secondary" className="gap-1 pr-1">
          <span className="font-medium">{c.label}:</span> {c.value}
          <button
            className="ml-1 rounded-sm hover:bg-muted p-0.5"
            aria-label={`Clear ${c.label}`}
            onClick={() => onClear(c.key)}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="text-muted-foreground"
      >
        Clear all
      </Button>
    </div>
  );
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};
