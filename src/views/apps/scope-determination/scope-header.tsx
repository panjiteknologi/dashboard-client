import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
// import {
//   Command,
//   CommandGroup,
//   CommandItem,
//   CommandList,
//   CommandEmpty,
// } from "@/components/ui/command";
import {
  // Filter,
  ChevronDown,
  X,
  // ListOrdered,
  Search,
  // ChevronRight,
  // RotateCcw,
} from "lucide-react";
// import { useScopeListQuery } from "@/hooks/use-scope-list";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";

export const ScopeHeader = () => {
  const [isLangPopoverOpen, setIsLangPopoverOpen] = useState(false);

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
    // Language Selection
    selectedLang,
    setSelectedLang,
  } = useScopeDeterminationContext();

  const [inputValue, setInputValue] = useState(query);

  useEffect(() => {
    setInputValue(query);
  }, [query]);

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
    if (!inputValue.trim()) return;
    if (query !== inputValue) {
      setQuery(inputValue);
    }
    await determinateScope(inputValue);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
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

  // Handle language selection
  const handleLanguageSelect = (lang: "IDN" | "EN") => {
    setSelectedLang(lang);
    setIsLangPopoverOpen(false);
  };

  return (
    <>
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

          {/* Search Input with Language Filter */}
          <div className="flex gap-2 items-center">
            {/* Language Filter - Left Side */}
            <div className="flex-shrink-0">
              <Popover
                open={isLangPopoverOpen}
                onOpenChange={setIsLangPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-12 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300"
                  >
                    <span className="text-sm font-medium">
                      {selectedLang === "IDN" ? "IDN" : "EN"}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-32 p-1" align="start">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant={selectedLang === "IDN" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleLanguageSelect("IDN")}
                      className="justify-start text-xs font-medium"
                    >
                      IDN - Indonesia
                    </Button>
                    <Button
                      variant={selectedLang === "EN" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => handleLanguageSelect("EN")}
                      className="justify-start text-xs font-medium"
                    >
                      EN - English
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {/* Search Input - Right Side */}
            <div className="relative flex-1">
              <Input
                ref={searchRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  selectedLang === "IDN"
                    ? "Tanyakan scope apa yang Anda butuhkan... (tekan Enter)"
                    : "Ask for the scope you need... (press Enter)"
                }
                className="pl-4 pr-24 h-12 rounded-xl text-base shadow-sm"
                aria-label="Search scopes"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                {inputValue.trim() && (
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
                {!!inputValue && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg"
                    onClick={() => {
                      setInputValue("");
                      setQuery("");
                    }}
                    aria-label="Clear"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Keyboard shortcut hint */}
          <div className="mt-2 text-center">
            <span className="text-xs text-muted-foreground">
              {selectedLang === "IDN" ? (
                <>
                  Tekan{" "}
                  <kbd className="px-1.5 py-0.5 border rounded text-xs">
                    Enter
                  </kbd>{" "}
                  untuk mencari atau{" "}
                  <kbd className="px-1.5 py-0.5 border rounded text-xs">
                    /
                  </kbd>{" "}
                  untuk fokus
                </>
              ) : (
                <>
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 border rounded text-xs">
                    Enter
                  </kbd>{" "}
                  to search or{" "}
                  <kbd className="px-1.5 py-0.5 border rounded text-xs">
                    /
                  </kbd>{" "}
                  to focus
                </>
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};