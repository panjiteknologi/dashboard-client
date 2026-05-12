import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Send, RotateCcw } from "lucide-react";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";

export const ScopeHeader = () => {
  const [inputValue, setInputValue] = useState("");

  const {
    searchRef,
    quick,
    isLoadingAI,
    isChatLoading,
    chatPhase,
    chatMessages,
    chatKeywords,
    sendChatMessage,
    resetAll,
    selectedLang,
  } = useScopeDeterminationContext();

  const isLoading = isLoadingAI || isChatLoading;
  const isChatActive = chatMessages.length > 0 || chatPhase !== "idle";
  const hasResults = !!chatKeywords;

  // Handle manual text input → chat mode
  const handleSendChat = async () => {
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue.trim();
    setInputValue("");
    await sendChatMessage(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() && !isLoading) {
      handleSendChat();
    }
  };

  // Quick chip → direct mode (bypass chat)
  const handleQuickSearch = async (keyword: string) => {
    resetAll();
    setInputValue("");
    await sendChatMessage(keyword);
  };

  const handleReset = () => {
    resetAll();
    setInputValue("");
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [searchRef]);

  return (
    <div className="sticky bottom-0 z-10 pb-4 px-4">
      <div className="max-w-4xl mx-auto w-full bg-background border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-4">
        {/* Quick filters */}
        <div className="mb-3">
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

        {/* Input row */}
        <div className="flex gap-2 items-center">
          {/* Text input */}
          <div className="relative flex-1">
            <Input
              ref={searchRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              placeholder={
                hasResults
                  ? selectedLang === "IDN"
                    ? "Tanya lebih lanjut atau konfirmasi jawaban..."
                    : "Ask a follow-up or confirm the result..."
                  : isChatActive
                  ? selectedLang === "IDN"
                    ? "Ketik jawaban Anda di sini..."
                    : "Type your answer here..."
                  : selectedLang === "IDN"
                  ? "Ceritakan bisnis Anda... (tekan Enter)"
                  : "Describe your business... (press Enter)"
              }
              className="pl-4 pr-24 h-12 rounded-xl text-base shadow-sm"
              aria-label="Chat input"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              {/* Reset button (when chat is active) */}
              {isChatActive && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleReset}
                  title={selectedLang === "IDN" ? "Mulai ulang" : "Start over"}
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              )}

              {/* Send button */}
              {inputValue.trim() && (
                <Button
                  variant="default"
                  size="icon"
                  onClick={handleSendChat}
                  disabled={isLoading}
                  aria-label="Send"
                  className="h-8 w-8 rounded-lg"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              )}

              {/* Clear input button */}
              {inputValue && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => setInputValue("")}
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Hint text */}
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">
            {isChatActive ? (
              selectedLang === "IDN" ? (
                <>AI akan bertanya untuk memahami bisnis Anda sebelum menentukan scope</>
              ) : (
                <>AI will ask questions to understand your business before determining scope</>
              )
            ) : selectedLang === "IDN" ? (
              <>
                Tekan{" "}
                <kbd className="px-1.5 py-0.5 border rounded text-xs">Enter</kbd>{" "}
                untuk mulai konsultasi atau{" "}
                <kbd className="px-1.5 py-0.5 border rounded text-xs">/</kbd>{" "}
                untuk fokus
              </>
            ) : (
              <>
                Press{" "}
                <kbd className="px-1.5 py-0.5 border rounded text-xs">Enter</kbd>{" "}
                to start consultation or{" "}
                <kbd className="px-1.5 py-0.5 border rounded text-xs">/</kbd>{" "}
                to focus
              </>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
