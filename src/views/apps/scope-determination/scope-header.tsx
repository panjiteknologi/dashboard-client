import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Filter,
  ChevronDown,
  X,
  ListOrdered,
  Search,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useScopeListQuery } from "@/hooks/use-scope-list";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";

export const ScopeHeader = () => {
  const {
    query,
    setQuery,
    searchRef,
    quick,
    showCodes,
    setShowCodes,
    scopeId,
    setScopeId,
    scopeLabel,
    isLoadingChips,
    shouldQuery,
    isLoadingList,
    total,
  } = useScopeDeterminationContext();

  const { data: listResp } = useScopeListQuery();
  const scopeList = Array.isArray(listResp?.data) ? listResp!.data : [];

  // Check if any filter is active
  const hasActiveFilters = query || scopeId !== scopeList?.[0]?.id;

  // Refresh page
  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="pb-3">
        {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
        <div className="flex px-2 flex-col sm:flex-row sm:items-center gap-2 sm:gap-2">
          {/* Title - Hidden on mobile, shown on desktop */}
          <div className="hidden px-2 sm:block text-sm font-medium sm:w-28">
            Scope Search
          </div>

          {/* Search Input - Full width on mobile */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari sektor…"
              className="pl-9 pr-10 h-10 rounded-lg w-full"
              aria-label="Search scopes"
            />
            {!!query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Buttons - Full width on mobile, side by side on tablet+ */}
          <div className="flex gap-2 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 rounded-lg flex-1 sm:flex-none"
                  disabled={isLoadingChips || scopeList?.length === 0}
                >
                  <Filter className="h-4 w-4" />
                  <span className="truncate">
                    {isLoadingChips ? "Loading..." : scopeLabel}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="p-0 w-72">
                <Command>
                  <CommandList>
                    <CommandEmpty>Tidak ada standar.</CommandEmpty>
                    <CommandGroup heading="Standards">
                      {isLoadingChips
                        ? Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="px-2 py-2">
                              <div className="h-4 w-40 rounded bg-slate-200 animate-pulse" />
                            </div>
                          ))
                        : scopeList?.map((s) => (
                            <CommandItem
                              key={s.id}
                              onSelect={() => {
                                if (s.id !== scopeId) {
                                  setScopeId(s.id);
                                }
                              }}
                              className="flex items-center justify-between"
                            >
                              <span>{s.title}</span>
                              <ChevronRight className="h-4 w-4 opacity-60" />
                            </CommandItem>
                          ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button
              variant={showCodes ? "default" : "outline"}
              onClick={() => setShowCodes((s) => !s)}
              className="gap-2 rounded-lg flex-1 sm:flex-none whitespace-nowrap"
            >
              <ListOrdered className="h-4 w-4" />
              <span className="hidden xs:inline">
                {showCodes ? "Codes On" : "Codes Off"}
              </span>
              <span className="xs:hidden">Codes</span>
            </Button>

            {/* Reset Button - Refresh page */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={handleReset}
                className="gap-2 rounded-lg whitespace-nowrap"
                title="Refresh halaman"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            )}
          </div>
        </div>

        {/* Quick filters and keyboard shortcut hint */}
        <div className="mt-3 px-2 flex flex-wrap items-center gap-2">
          {quick.map((k) => (
            <Badge
              key={k}
              variant="secondary"
              className="cursor-pointer rounded-lg text-xs"
              onClick={() => setQuery(k)}
            >
              {k}
            </Badge>
          ))}
          <span className="hidden sm:inline ml-auto text-xs text-muted-foreground whitespace-nowrap">
            Tekan <kbd className="px-1 py-0.5 border rounded">/</kbd> untuk
            fokus.
          </span>
        </div>

        {/* Results text */}
        {shouldQuery && (
          <div className="mt-3 px-3 text-xs text-muted-foreground">
            Berikut hasil scope <b>PT TSI Sertifikasi Internasional</b> yang
            tersedia untuk perusahaan anda berdasarkan kata kunci pencarian.
          </div>
        )}
      </div>
    </div>
  );
};