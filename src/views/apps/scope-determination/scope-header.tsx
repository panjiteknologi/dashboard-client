import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import {
//   Popover,
//   PopoverTrigger,
//   PopoverContent,
// } from "@/components/ui/popover";
// import {
//   Command,
//   CommandGroup,
//   CommandItem,
//   CommandList,
//   CommandEmpty,
// } from "@/components/ui/command";
import {
  // Filter,
  // ChevronDown,
  X,
  // ListOrdered,
  Search,
  // ChevronRight,
  // RotateCcw,
} from "lucide-react";
// import { useScopeListQuery } from "@/hooks/use-scope-list";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";

export const ScopeHeader = () => {
  const {
    query,
    setQuery,
    searchRef,
    quick,
    // showCodes,
    // setShowCodes,
    // scopeId,
    // setScopeId,
    // scopeLabel,
    // isLoadingChips,
    // shouldQuery,
    // isLoadingList,
    // total,
    // AI Scope Determination from context
    // aiResponse,
    isLoadingAI,
    determinateScope,
  } = useScopeDeterminationContext();

  // const { data: listResp } = useScopeListQuery();
  // const scopeList = Array.isArray(listResp?.data) ? listResp!.data : [];

  // Check if any filter is active
  // const hasActiveFilters = query || scopeId !== scopeList?.[0]?.id;

  // Refresh page
  // const handleReset = () => {
  //   window.location.reload();
  // };

  // Handle AI scope determination
  const handleAIDetermination = async () => {
    if (!query.trim()) return;
    await determinateScope(query);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      handleAIDetermination();
    }
  };

  // Handle quick search click
  const handleQuickSearch = (keyword: string) => {
    setQuery(keyword);
    // Focus on search input after setting query
    setTimeout(() => {
      searchRef.current?.focus();
    }, 0);
  };

  return (
    <div className="sticky bottom-0 z-10 bg-background border-t">
      <div className="p-4">
        {/* Quick filters */}
        <div className="mb-3">
          {/* Scrollable horizontal badges */}
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-3 pl-0">
            <span className="text-xs text-muted-foreground pr-2 whitespace-nowrap sticky left-0 bg-background z-10">
              Quick search:
            </span>
            {quick.map((k) => (
              <Badge
                key={k}
                variant="secondary"
                className="cursor-pointer rounded-lg text-xs whitespace-nowrap hover:bg-secondary/80 flex-shrink-0"
                onClick={() => handleQuickSearch(k)}
              >
                {k}
              </Badge>
            ))}
          </div>
        </div>


        {/* Search Input */}
        <div className="relative">
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Tanyakan scope apa yang Anda butuhkan... (tekan Enter)"
            className="pl-4 pr-24 h-12 rounded-xl text-base shadow-sm"
            aria-label="Search scopes"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {query.trim() && (
              <Button
                variant="default"
                size="icon"
                onClick={handleAIDetermination}
                disabled={isLoadingAI}
                aria-label="AI Search"
                title="Pencarian menggunakan AI"
                className="h-8 w-8 rounded-lg"
              >
                {isLoadingAI ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            )}
            {!!query && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setQuery("")}
                aria-label="Clear"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Keyboard shortcut hint */}
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">
            Tekan <kbd className="px-1.5 py-0.5 border rounded text-xs">Enter</kbd> untuk mencari atau{" "}
            <kbd className="px-1.5 py-0.5 border rounded text-xs">/</kbd> untuk fokus
          </span>
        </div>
      </div>
    </div>
  );
};