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
  Search as SearchIcon,
  ChevronRight as ArrowRight,
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

  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="pb-3 px-3">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium w-28">Scope Search</div>

          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari sektor…"
              className="pl-9 pr-10 h-10 rounded-lg"
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 rounded-lg"
                disabled={isLoadingChips || scopeList?.length === 0}
              >
                <Filter className="h-4 w-4" />
                {isLoadingChips ? "Loading..." : scopeLabel}
                <ChevronDown className="h-4 w-4" />
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
                            <ArrowRight className="h-4 w-4 opacity-60" />
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
            className="gap-2 rounded-lg"
          >
            <ListOrdered className="h-4 w-4" />
            {showCodes ? "Codes On" : "Codes Off"}
          </Button>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {quick.map((k) => (
            <Badge
              key={k}
              variant="secondary"
              className="cursor-pointer rounded-lg"
              onClick={() => setQuery(k)}
            >
              {k}
            </Badge>
          ))}
          <span className="ml-auto text-xs text-muted-foreground">
            Tekan <kbd className="px-1 py-0.5 border rounded">/</kbd> untuk
            fokus.
          </span>
        </div>

        {shouldQuery && (
          <div className="mt-2 text-xs text-muted-foreground">
            {isLoadingList ? "Memuat…" : `${total} hasil`} • {scopeLabel}
          </div>
        )}

        <Separator className="mt-3" />
      </div>
    </div>
  );
};
