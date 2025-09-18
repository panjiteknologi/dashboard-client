import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { HistoryTypes } from "@/types/audit-history";
import { useMemo } from "react";

type ChangeItem = {
  label: string;
  old?: unknown;
  new?: unknown;
};

function toDisplay(val: unknown) {
  if (val == null || val === "") return "-";
  if (typeof val === "object") {
    try {
      return JSON.stringify(val, null, 2);
    } catch {
      return String(val);
    }
  }
  return String(val);
}

export const AuditHistoryDetail = ({ data }: { data: HistoryTypes }) => {
  const changes = useMemo<ChangeItem[]>(
    () => (Array.isArray(data?.changes) ? data.changes : []),
    [data]
  );

  const changeCount = changes.length;

  return (
    <div className="bg-white text-sm space-y-3 max-h-[420px] overflow-auto rounded-b-md shadow-inner">
      {changeCount === 0 ? (
        <p className="text-muted-foreground italic">Tidak ada perubahan.</p>
      ) : (
        <ul className="space-y-2">
          {changes.map((chg, idx) => (
            <li key={idx} className="border rounded-lg">
              <Collapsible>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="min-w-0">
                    <p className="font-medium text-sm break-words">
                      {chg.label}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      <span className="line-through text-gray-400">
                        {toDisplay(chg.old)}
                      </span>{" "}
                      →{" "}
                      <span className="text-blue-600">
                        {toDisplay(chg.new)}
                      </span>
                    </p>
                  </div>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Toggle change detail"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent className="px-3 pb-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="rounded-md border p-2 bg-gray-50">
                      <p className="text-xs font-semibold mb-1">Old</p>
                      <pre className="text-xs whitespace-pre-wrap break-words">
                        {toDisplay(chg.old)}
                      </pre>
                    </div>
                    <div className="rounded-md border p-2 bg-gray-50">
                      <p className="text-xs font-semibold mb-1">New</p>
                      <pre className="text-xs whitespace-pre-wrap break-words text-blue-700">
                        {toDisplay(chg.new)}
                      </pre>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
