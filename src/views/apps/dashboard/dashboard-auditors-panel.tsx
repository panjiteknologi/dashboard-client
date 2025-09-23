/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DashboardRoleLabel } from "@/constant";
import {
  Check,
  ChevronDown,
  Columns2,
  Download,
  Filter as FilterIcon,
  Search,
  SortAsc,
  SortDesc,
  Tag,
  User2,
  X,
} from "lucide-react";
import { DashboardAuditorsTable } from "./dashboard-auditors-tables";

export type Auditor = {
  id: string | number;
  name: string;
  role: "lead_auditor" | "auditor_1" | "auditor_2" | string;
  standards?: string[];
  projectsCount?: number;
  lastAuditDate?: string;
};

export const DashboardAuditorsPanel = ({
  auditors,
  qAuditor,
  loading,
  setQAuditor,
  roleFilter,
  setRoleFilter,
  stdFilter,
  setStdFilter,
  minProjects,
  setMinProjects,
  sortKey,
  setSortKey,
  sortDesc,
  setSortDesc,
  allStandards,
  reset,
}: {
  auditors: Auditor[];
  qAuditor: string;
  loading: boolean;
  setQAuditor: (v: string) => void;
  roleFilter: "all" | "lead_auditor" | "auditor_1" | "auditor_2";
  setRoleFilter: (
    v: "all" | "lead_auditor" | "auditor_1" | "auditor_2"
  ) => void;
  stdFilter: string;
  setStdFilter: (v: string) => void;
  minProjects: number;
  setMinProjects: (v: number) => void;
  sortKey: "projects" | "last_audit" | "name";
  setSortKey: (v: "projects" | "last_audit" | "name") => void;
  sortDesc: boolean;
  setSortDesc: (v: boolean) => void;
  allStandards: string[];
  reset: () => void;
}) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [density, setDensity] = useState<"compact" | "comfortable">("compact");
  const [cols, setCols] = useState({
    role: true,
    standards: true,
    projects: true,
    lastAudit: true,
  });

  const stdItems = useMemo(
    () => (allStandards || []).map((s) => ({ label: s, value: s })),
    [allStandards]
  );

  const filtered = useMemo(() => {
    const q = (qAuditor || "").trim().toLowerCase();
    return (auditors || []).filter((a) => {
      if (q && !`${a.name}`.toLowerCase().includes(q)) return false;
      if (roleFilter !== "all" && `${a.role}` !== roleFilter) return false;
      if (minProjects > 0 && (a.projectsCount || 0) < minProjects) return false;
      if (stdFilter !== "all") {
        const arr = a.standards || [];
        if (!arr.some((s) => s === stdFilter)) return false;
      }
      return true;
    });
  }, [auditors, qAuditor, roleFilter, stdFilter, minProjects]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let va: string | number = 0,
        vb: string | number = 0;
      if (sortKey === "projects") {
        va = a.projectsCount ?? 0;
        vb = b.projectsCount ?? 0;
      } else if (sortKey === "last_audit") {
        va = a.lastAuditDate ? new Date(a.lastAuditDate).getTime() : 0;
        vb = b.lastAuditDate ? new Date(b.lastAuditDate).getTime() : 0;
      } else {
        va = (a.name || "").toLowerCase();
        vb = (b.name || "").toLowerCase();
      }
      if (va < vb) return sortDesc ? 1 : -1;
      if (va > vb) return sortDesc ? -1 : 1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDesc]);

  const pageKey = `${qAuditor}|${roleFilter}|${stdFilter}|${minProjects}|${sortKey}|${sortDesc}|${sorted.length}`;
  useEffect(() => {
    setPage(1);
  }, [pageKey]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageSafe = Math.min(page, totalPages);
  const start = (pageSafe - 1) * pageSize;
  const current = sorted.slice(start, start + pageSize);

  const exportCSV = () => {
    const rows = [
      ["name", "role", "standards", "projectsCount", "lastAuditDate"],
      ...sorted.map((a) => [
        a.name,
        a.role,
        (a.standards || []).join("|"),
        String(a.projectsCount ?? 0),
        a.lastAuditDate || "",
      ]),
    ];
    const csv = rows
      .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditors_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearableBadges = [
    qAuditor
      ? {
          key: "q",
          label: (
            <>
              <Search className="h-3.5 w-3.5" />
              Cari: “{qAuditor}”
            </>
          ),
          onClear: () => setQAuditor(""),
        }
      : null,
    roleFilter !== "all"
      ? {
          key: "role",
          label: (
            <>
              <User2 className="h-3.5 w-3.5" />
              Peran: {DashboardRoleLabel[roleFilter]}
            </>
          ),
          onClear: () => setRoleFilter("all"),
        }
      : null,
    stdFilter !== "all"
      ? {
          key: "std",
          label: (
            <>
              <Tag className="h-3.5 w-3.5" />
              Standar: {stdFilter}
            </>
          ),
          onClear: () => setStdFilter("all"),
        }
      : null,
    minProjects > 0
      ? {
          key: "min",
          label: <>Min Proyek: {minProjects}+</>,
          onClear: () => setMinProjects(0),
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: React.ReactNode;
    onClear: () => void;
  }[];

  const FilterBar = () => (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-xl border bg-background p-2 md:gap-3"
      )}
    >
      <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-lg border bg-card px-2 py-1.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          value={qAuditor}
          onChange={(e) => setQAuditor(e.target.value)}
          placeholder="Cari auditor…"
          className="h-8 border-none p-0 shadow-none focus-visible:ring-0"
          aria-label="Cari auditor"
        />
        {qAuditor && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={() => setQAuditor("")}
            aria-label="Bersihkan"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
          >
            <User2 className="mr-1.5 h-3.5 w-3.5" />
            {roleFilter === "all"
              ? "Semua peran"
              : roleFilter === "lead_auditor"
              ? "Lead"
              : roleFilter === "auditor_1"
              ? "Auditor I"
              : "Auditor II"}
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40">
          <DropdownMenuLabel className="text-xs">Peran</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {[
            { v: "all", l: "Semua" },
            { v: "lead_auditor", l: "Lead" },
            { v: "auditor_1", l: "Auditor I" },
            { v: "auditor_2", l: "Auditor II" },
          ].map((r, i) => (
            <DropdownMenuItem
              key={i}
              className="text-xs"
              onClick={() => setRoleFilter(r.v as any)}
            >
              {r.l}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
          >
            <Tag className="mr-1.5 h-3.5 w-3.5" />
            {stdFilter === "all" ? "Semua standar" : stdFilter}
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[260px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Cari standar…" />
            <CommandList>
              <CommandEmpty>Tidak ditemukan</CommandEmpty>
              <CommandGroup heading="Pilih standar">
                <CommandItem
                  onSelect={() => setStdFilter("all")}
                  className="text-xs"
                >
                  <Check
                    className={cn(
                      "mr-2 h-3.5 w-3.5",
                      stdFilter === "all" ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Semua
                </CommandItem>
                <Separator />
                {stdItems.map((it) => (
                  <CommandItem
                    key={it.value}
                    onSelect={() => setStdFilter(it.value)}
                    className="text-xs"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-3.5 w-3.5",
                        stdFilter === it.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {it.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
          >
            Min {minProjects}+
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-36">
          {[0, 1, 2, 3, 5].map((n) => (
            <DropdownMenuItem
              key={n}
              className="text-xs"
              onClick={() => setMinProjects(n)}
            >
              {n}+ proyek
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs"
          >
            {sortKey === "projects"
              ? "# Proyek"
              : sortKey === "last_audit"
              ? "Terakhir Audit"
              : "Nama"}
            <ChevronDown className="ml-1.5 h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-44">
          <DropdownMenuLabel className="text-xs">
            Urutkan berdasarkan
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-xs"
            onClick={() => setSortKey("name")}
          >
            Nama
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onClick={() => setSortKey("projects")}
          >
            # Proyek
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-xs"
            onClick={() => setSortKey("last_audit")}
          >
            Terakhir Audit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="sm"
        className="h-8 w-20 rounded-lg text-xs"
        onClick={() => setSortDesc(!sortDesc)}
      >
        {sortDesc ? (
          <>
            <SortDesc className="mr-1 h-3.5 w-3.5" /> Desc
          </>
        ) : (
          <>
            <SortAsc className="mr-1 h-3.5 w-3.5" /> Asc
          </>
        )}
      </Button>

      {/* Reset */}
      <Button
        variant="ghost"
        size="sm"
        className="ml-auto h-8 rounded-full"
        onClick={() => {
          reset();
          setPage(1);
        }}
      >
        <X className="mr-1 h-4 w-4" /> Reset
      </Button>
    </div>
  );

  return (
    <div className="mt-8">
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight">
        <FilterIcon className="h-4 w-4" />
        Table Auditor
      </h2>

      <div className="mt-3">
        <Card
          className={cn(
            "group relative overflow-hidden rounded-2xl border bg-card transition-all",
            "hover:shadow-lg hover:border-primary/40"
          )}
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/60 via-primary to-primary/60" />

          <CardHeader className="pb-1">
            <CardTitle className="flex items-center justify-between gap-2 text-sm font-semibold tracking-tight">
              <span />
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 rounded-full text-xs"
                    >
                      <Columns2 className="mr-2 h-3.5 w-3.5" /> Kolom
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuLabel className="text-xs">
                      Tampilkan
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={cols.role}
                      onCheckedChange={(v) =>
                        setCols((c) => ({ ...c, role: !!v }))
                      }
                      className="text-xs"
                    >
                      Peran
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={cols.standards}
                      onCheckedChange={(v) =>
                        setCols((c) => ({ ...c, standards: !!v }))
                      }
                      className="text-xs"
                    >
                      Standar
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={cols.projects}
                      onCheckedChange={(v) =>
                        setCols((c) => ({ ...c, projects: !!v }))
                      }
                      className="text-xs"
                    >
                      # Proyek
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={cols.lastAudit}
                      onCheckedChange={(v) =>
                        setCols((c) => ({ ...c, lastAudit: !!v }))
                      }
                      className="text-xs"
                    >
                      Terakhir Audit
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel className="text-xs">
                      Density
                    </DropdownMenuLabel>
                    <DropdownMenuItem
                      className={cn(
                        "text-xs",
                        density === "compact" && "font-medium"
                      )}
                      onClick={() => setDensity("compact")}
                    >
                      Compact
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={cn(
                        "text-xs",
                        density === "comfortable" && "font-medium"
                      )}
                      onClick={() => setDensity("comfortable")}
                    >
                      Comfortable
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Badge variant="secondary" className="rounded-full">
                  Total: {total}
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 rounded-full text-xs"
                  onClick={exportCSV}
                >
                  <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
                </Button>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 pt-0">
            <FilterBar />

            {clearableBadges.length > 0 && (
              <>
                <Separator className="my-2" />
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {clearableBadges.map((b) => (
                    <Badge
                      key={b.key}
                      variant="outline"
                      className="group flex items-center gap-1"
                    >
                      {b.label}
                      <button
                        onClick={b.onClear}
                        className="ml-1 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
                        aria-label={`Hapus filter ${b.key}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </>
            )}

            <TooltipProvider>
              <div className="rounded-2xl border">
                <div className="relative max-h-[52vh] overflow-auto rounded-2xl">
                  <DashboardAuditorsTable
                    loading={loading}
                    density={density}
                    cols={cols}
                    sortKey={sortKey}
                    setSortKey={setSortKey}
                    sortDesc={sortDesc}
                    setSortDesc={setSortDesc}
                    current={current}
                    start={start}
                  />
                </div>

                <div className="flex items-center justify-between gap-3 p-3">
                  <div className="text-xs text-muted-foreground">
                    Menampilkan{" "}
                    <span className="font-medium">{current.length}</span> dari{" "}
                    <span className="font-medium">{total}</span> auditor
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-lg text-xs"
                        >
                          {pageSize} / halaman
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {[10, 20, 50].map((n) => (
                          <DropdownMenuItem
                            key={n}
                            className="text-xs"
                            onClick={() => {
                              setPageSize(n);
                              setPage(1);
                            }}
                          >
                            {n} / halaman
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-xs"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={pageSafe === 1}
                    >
                      Prev
                    </Button>
                    <div className="px-1 text-xs">
                      {pageSafe} / {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-xs"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={pageSafe >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
