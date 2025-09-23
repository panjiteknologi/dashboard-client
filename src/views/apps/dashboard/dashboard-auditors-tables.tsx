/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DashboardRoleLabel } from "@/constant";
import { ArrowUpDown } from "lucide-react";

export const DashboardAuditorsTable = ({
  loading,
  density,
  cols,
  sortKey,
  setSortKey,
  sortDesc,
  setSortDesc,
  current,
  start,
}: {
  loading: boolean;
  density: "compact" | "comfortable";
  cols: {
    role: boolean;
    standards: boolean;
    projects: boolean;
    lastAudit: boolean;
  };
  sortKey: "projects" | "last_audit" | "name";
  setSortKey: (v: "projects" | "last_audit" | "name") => void;
  sortDesc: boolean;
  setSortDesc: (v: boolean) => void;
  current: any[];
  start: number;
}) => {
  const headerSortBtn = (
    key: "name" | "projects" | "last_audit",
    label: string,
    alignRight = false
  ) => {
    const active = sortKey === key;
    return (
      <button
        type="button"
        className={cn(
          "inline-flex items-center gap-1 text-xs font-medium",
          alignRight && "ml-auto"
        )}
        onClick={() => {
          if (sortKey === key) setSortDesc(!sortDesc);
          else {
            setSortKey(key);
            setSortDesc(true);
          }
        }}
      >
        {label}
        <ArrowUpDown
          className={cn("h-3.5 w-3.5 opacity-50", active && "opacity-100")}
        />
      </button>
    );
  };

  const isRecent = (iso?: string) => {
    if (!iso) return false;
    const d = new Date(iso).getTime();
    const diff = Date.now() - d;
    return diff <= 30 * 24 * 60 * 60 * 1000;
  };

  const getInitials = (name: string) => {
    const parts = (name || "").trim().split(/\s+/).slice(0, 2);
    return parts.map((p) => p[0]?.toUpperCase() || "").join("") || "AU";
  };

  return (
    <Table
      className={cn(
        "text-sm",
        density === "compact"
          ? "[&_td]:py-2.5 [&_th]:py-2.5"
          : "[&_td]:py-3.5 [&_th]:py-3.5"
      )}
    >
      <TableHeader className="sticky top-0 z-10 bg-card/90 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <TableRow>
          <TableHead className="w-[46px]">No</TableHead>
          <TableHead>{headerSortBtn("name", "Nama")}</TableHead>
          {cols.role && <TableHead className="w-[140px]">Peran</TableHead>}
          {cols.standards && <TableHead>Standar</TableHead>}
          {cols.projects && (
            <TableHead className="w-[120px]">
              {headerSortBtn("projects", "# Proyek", true)}
            </TableHead>
          )}
          {cols.lastAudit && (
            <TableHead className="w=[160px]">
              {headerSortBtn("last_audit", "Terakhir Audit")}
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={`sk-${i}`} className="animate-pulse">
              <TableCell className="py-4">
                <div className="h-3 w-6 rounded bg-muted" />
              </TableCell>
              <TableCell>
                <div className="h-3 w-48 rounded bg-muted" />
              </TableCell>
              {cols.role && (
                <TableCell>
                  <div className="h-3 w-24 rounded bg-muted" />
                </TableCell>
              )}
              {cols.standards && (
                <TableCell>
                  <div className="h-3 w-56 rounded bg-muted" />
                </TableCell>
              )}
              {cols.projects && (
                <TableCell className="text-right">
                  <div className="ml-auto h-3 w-10 rounded bg-muted" />
                </TableCell>
              )}
              {cols.lastAudit && (
                <TableCell>
                  <div className="h-3 w-24 rounded bg-muted" />
                </TableCell>
              )}
            </TableRow>
          ))
        ) : current.length ? (
          current.map((a, idx) => {
            const standards = a.standards || [];
            const show = standards.slice(0, 4);
            const more = Math.max(0, standards.length - show.length);
            return (
              <TableRow
                key={a.id}
                className={cn(
                  "hover:bg-muted/40",
                  idx % 2 === 1 && "bg-muted/10"
                )}
              >
                <TableCell
                  className={density === "compact" ? "py-2.5" : "py-3.5"}
                >
                  {start + idx + 1}
                </TableCell>
                <TableCell
                  className={cn(
                    "font-medium",
                    density === "compact" ? "py-2.5" : "py-3.5"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[11px]">
                        {getInitials(a.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate">{a.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(a.standards || []).slice(0, 2).join(" • ") || "—"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                {cols.role && (
                  <TableCell
                    className={density === "compact" ? "py-2.5" : "py-3.5"}
                  >
                    <Badge variant="secondary" className="rounded-full">
                      {DashboardRoleLabel[
                        a.role as keyof typeof DashboardRoleLabel
                      ] || a.role}
                    </Badge>
                  </TableCell>
                )}
                {cols.standards && (
                  <TableCell
                    className={density === "compact" ? "py-2.5" : "py-3.5"}
                  >
                    <div className="flex flex-wrap gap-1">
                      {show.map((s: string, i: number) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="rounded-full"
                        >
                          {s}
                        </Badge>
                      ))}
                      {!!more && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Badge
                              variant="outline"
                              className="cursor-pointer rounded-full"
                            >
                              +{more}
                            </Badge>
                          </PopoverTrigger>
                          <PopoverContent className="w-56 text-xs">
                            <div className="mb-1 font-medium">
                              Semua standar
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {standards.map((s: string, i: number) => (
                                <Badge
                                  key={i}
                                  variant="secondary"
                                  className="rounded-full"
                                >
                                  {s}
                                </Badge>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>
                )}
                {cols.projects && (
                  <TableCell
                    className={cn(
                      "text-right",
                      density === "compact" ? "py-2.5" : "py-3.5"
                    )}
                  >
                    {a.projectsCount ?? 0}
                  </TableCell>
                )}
                {cols.lastAudit && (
                  <TableCell
                    className={density === "compact" ? "py-2.5" : "py-3.5"}
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {a.lastAuditDate
                          ? new Date(a.lastAuditDate).toLocaleDateString(
                              "id-ID"
                            )
                          : "-"}
                      </span>
                      {isRecent(a.lastAuditDate) && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge
                              variant="default"
                              className="rounded-full text-[10px]"
                            >
                              Baru
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="text-xs">
                            Audit ≤ 30 hari yang lalu
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={
                1 +
                Number(cols.role) +
                Number(cols.standards) +
                Number(cols.projects) +
                Number(cols.lastAudit) +
                1
              }
              className="py-10 text-center text-sm text-muted-foreground"
            >
              Tidak ada data yang cocok dengan filter.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
