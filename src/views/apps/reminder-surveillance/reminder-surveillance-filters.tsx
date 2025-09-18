/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

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
import { ActiveFilterChips } from "./reminder-surveillance-helpers";
import { useReminderSurveillance } from "@/context/surveillance-context";

export function ReminderSurveillanceFilters({
  onPageChange,
}: {
  onPageChange: (page: number) => void;
}) {
  const {
    qInput,
    setQInput,
    q,
    stage,
    setStageSafe,
    urgency,
    setUrgencySafe,
    iso,
    setIsoSafe,
    drawerOpen,
    setDrawerOpen,
    stageTmp,
    setStageTmp,
    urgencyTmp,
    setUrgencyTmp,
    isoTmp,
    setIsoTmp,
    applyDrawer,
    resetDrawer,
    isoOptions,
    hasActiveFilters,
    clearAll,
  } = useReminderSurveillance();

  return (
    <Card className="border-dashed">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </CardTitle>

          <div className="flex md:hidden items-center gap-2">
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

                <div className="p-4 grid gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Stage</label>
                    <Select
                      value={stageTmp}
                      onValueChange={(v: any) => setStageTmp(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Stage: All</SelectItem>
                        <SelectItem value="s1">
                          Stage: Surveillance 1
                        </SelectItem>
                        <SelectItem value="s2">
                          Stage: Surveillance 2
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium">Urgency</label>
                    <Select
                      value={urgencyTmp}
                      onValueChange={(v: any) => setUrgencyTmp(v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Urgency: All</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
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
                        <SelectItem value="all">ISO: All</SelectItem>
                        {isoOptions.map((name: string, index: number) => (
                          <SelectItem key={index} value={name}>
                            {name}
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
                            onPageChange(1);
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
              aria-label="Search certificates"
              placeholder="Cari nomor sertifikat / scope / ISO..."
              className="pl-8"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
            />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
            <Input
              aria-label="Search certificates"
              placeholder="Cari nomor sertifikat / scope / ISO..."
              className="pl-8"
              value={qInput}
              onChange={(e) => setQInput(e.target.value)}
            />
          </div>

          <Select
            value={stage}
            onValueChange={(v: any) => {
              setStageSafe(v);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Stage: All</SelectItem>
              <SelectItem value="s1">Stage: Surveillance 1</SelectItem>
              <SelectItem value="s2">Stage: Surveillance 2</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={urgency}
            onValueChange={(v: any) => {
              setUrgencySafe(v);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Urgency: All</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={iso}
            onValueChange={(v: string) => {
              setIsoSafe(v);
            }}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="ISO Standard" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ISO: All</SelectItem>
              {isoOptions.map((name: string, index: number) => (
                <SelectItem key={index} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQInput("");
              clearAll();
            }}
            disabled={!hasActiveFilters && !q}
            title="Clear all filters"
          >
            Clear all
          </Button>
        </div>

        <ActiveFilterChips
          q={q}
          stage={stage}
          urgency={urgency}
          iso={iso}
          onClear={(key) => {
            if (key === "q") setQInput("");
            if (key === "stage") setStageSafe("all");
            if (key === "urgency") setUrgencySafe("all");
            if (key === "iso") setIsoSafe("all");
          }}
          onClearAll={() => {
            setQInput("");
            clearAll();
          }}
        />
      </CardContent>
    </Card>
  );
}
