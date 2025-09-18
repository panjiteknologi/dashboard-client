import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter, Search } from "lucide-react";
import { AuditorsActiveFilterChips } from "./auditors-filter-chip";

type Props = {
  qInput: string;
  setQInput: (v: string) => void;
  role: string;
  setRole: (v: string) => void;
  iso: string;
  setIso: (v: string) => void;
  limit: number;
  setLimit: (v: number) => void;
  allRoles: string[];
  allIsos: string[];
  reset: () => void;
};

export const AuditorsSearchFilter = ({
  qInput,
  setQInput,
  role,
  setRole,
  iso,
  setIso,
  limit,
  setLimit,
  allRoles,
  allIsos,
  reset,
}: Props) => {
  const roleOptions = useMemo(() => {
    const set = new Set(allRoles);
    set.add("all");
    return Array.from(set);
  }, [allRoles]);

  const isoOptions = useMemo(() => {
    const set = new Set(allIsos);
    set.add("all");
    return Array.from(set);
  }, [allIsos]);

  const hasActiveFilters =
    (qInput?.trim()?.length ?? 0) > 0 || role !== "all" || iso !== "all";

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleTmp, setRoleTmp] = useState(role);
  const [isoTmp, setIsoTmp] = useState(iso);
  const [limitTmp, setLimitTmp] = useState(String(limit));

  const applyDrawer = () => {
    setRole(roleTmp);
    setIso(isoTmp);
    setLimit(parseInt(limitTmp));
  };

  const resetDrawer = () => {
    setRoleTmp("all");
    setIsoTmp("all");
    setLimitTmp("10");
  };

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>

          <div className="flex items-center gap-2 md:hidden">
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" /> Filter
                </Button>
              </DrawerTrigger>

              <DrawerContent className="max-h-[85vh] p-6">
                <DrawerHeader>
                  <DrawerTitle>Filter</DrawerTitle>
                </DrawerHeader>

                <div className="grid gap-4 p-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Role</label>
                    <Select
                      value={roleTmp}
                      onValueChange={(v: string) => setRoleTmp(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {roleOptions.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">ISO Standard</label>
                    <Select
                      value={isoTmp}
                      onValueChange={(v: string) => setIsoTmp(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="ISO Standard" />
                      </SelectTrigger>
                      <SelectContent>
                        {isoOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Limit</label>
                    <Select
                      value={limitTmp}
                      onValueChange={(v: string) => setLimitTmp(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Limit" />
                      </SelectTrigger>
                      <SelectContent>
                        {["5", "10", "20", "50"].map((n) => (
                          <SelectItem key={n} value={n}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DrawerFooter className="gap-2">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      className="px-0 text-muted-foreground"
                      onClick={resetDrawer}
                    >
                      Reset
                    </Button>
                    <div className="flex gap-2">
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                      <DrawerClose asChild>
                        <Button
                          onClick={() => {
                            applyDrawer();
                          }}
                        >
                          Apply
                        </Button>
                      </DrawerClose>
                    </div>
                  </div>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
            <Input
              aria-label="Cari auditor"
              placeholder="Cari auditor (nama/jabatan)…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              className="pl-8"
              inputMode="search"
            />
          </div>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <div className="relative min-w-[280px] flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
            <Input
              aria-label="Cari auditor"
              placeholder="Cari auditor (nama/jabatan)…"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
              className="pl-8"
              inputMode="search"
            />
          </div>

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-44 capitalize">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              {allRoles.map((r) => {
                const label = r.replaceAll("_", " ");
                return (
                  <SelectItem key={r} value={r} className="capitalize">
                    {label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          <Select value={iso} onValueChange={setIso}>
            <SelectTrigger className="w-56 capitalize">
              <SelectValue placeholder="ISO" />
            </SelectTrigger>
            <SelectContent>
              {allIsos.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">
                  {s.replaceAll("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={String(limit)}
            onValueChange={(v) => setLimit(parseInt(v))}
          >
            <SelectTrigger className="w-24 capitalize">
              <SelectValue placeholder="Limit" />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)} className="capitalize">
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQInput("");
              reset();
            }}
            disabled={!hasActiveFilters}
            title="Clear all filters"
          >
            Clear all
          </Button>
        </div>

        <AuditorsActiveFilterChips
          q={qInput}
          role={role}
          iso={iso}
          onClear={(key) => {
            if (key === "q") setQInput("");
            if (key === "role") setRole("all");
            if (key === "iso") setIso("all");
          }}
          onClearAll={() => {
            setQInput("");
            reset();
          }}
        />
      </CardContent>
    </Card>
  );
};
