import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export const AuditorsActiveFilterChips = ({
  q,
  role,
  iso,
  onClear,
  onClearAll,
}: {
  q: string;
  role: string;
  iso: string;
  onClear: (key: "q" | "role" | "iso") => void;
  onClearAll: () => void;
}) => {
  const chips: Array<{
    key: "q" | "role" | "iso";
    label: string;
    value: string;
  }> = [];

  if (q?.trim()) chips.push({ key: "q", label: "Search", value: q.trim() });
  if (role !== "all") chips.push({ key: "role", label: "Role", value: role });
  if (iso !== "all") chips.push({ key: "iso", label: "ISO", value: iso });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <Badge
          key={c.key}
          variant="secondary"
          className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs"
        >
          <span className="font-medium">{c.label}:</span>
          <span className="max-w-[12rem] truncate" title={c.value}>
            {c.value}
          </span>
          <button
            type="button"
            onClick={() => onClear(c.key)}
            className="ml-1 inline-flex rounded-full p-0.5 hover:bg-muted"
            aria-label={`Clear ${c.label}`}
            title={`Clear ${c.label}`}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearAll}
        className="h-7 px-2 text-xs"
        title="Clear all filters"
      >
        Clear all
      </Button>
    </div>
  );
};
