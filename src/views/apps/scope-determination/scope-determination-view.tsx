"use client";

import { useEffect, useRef, useState } from "react";
import { PanelLeft } from "lucide-react";
import { ScopeHeader } from "./scope-header";
import { ScopeResult, extractQuestionBlocks, QuestionCard, QuestionBlock } from "./scope-result";
import { ScopeSidebar } from "./scope-sidebar";
import { useScopeDeterminationContext } from "@/context/scope-determination-context";

// ─── Question Bottom Sheet ────────────────────────────────────────────────────
const QuestionBottomSheet = () => {
  const { chatMessages, chatPhase, isChatLoading, sendChatMessage, selectedLang } =
    useScopeDeterminationContext();

  const [blocks, setBlocks] = useState<QuestionBlock[]>([]);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    const lastMsg = chatMessages[chatMessages.length - 1];
    const shouldShow =
      lastMsg?.role === "assistant" &&
      chatPhase === "asking" &&
      !isChatLoading;

    if (shouldShow) {
      const parsed = extractQuestionBlocks(lastMsg.content);
      if (parsed.length > 0) {
        setBlocks(parsed);
        requestAnimationFrame(() => setVisible(true));
        return;
      }
    }

    setVisible(false);
    hideTimer.current = setTimeout(() => setBlocks([]), 300);
  }, [chatMessages, chatPhase, isChatLoading]);

  if (blocks.length === 0) return null;

  return (
    <div
      className={`transition-all duration-300 ease-out will-change-transform flex-shrink-0 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 max-h-0 overflow-hidden pointer-events-none"
      }`}
    >
      <div className="px-4 pb-3 max-h-[420px] overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden">
          <QuestionCard
            blocks={blocks}
            onSubmit={(answer) => sendChatMessage(answer)}
            disabled={isChatLoading}
            selectedLang={selectedLang}
          />
        </div>
      </div>
    </div>
  );
};

// ─── Main View ────────────────────────────────────────────────────────────────
export const ScopeDeterminationView = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    chatHistory,
    activeConvId,
    loadConversation,
    deleteConversation,
    resetAll,
    selectedLang,
  } = useScopeDeterminationContext();

  // Default open on desktop, closed on mobile
  useEffect(() => {
    if (window.innerWidth >= 1024) setSidebarOpen(true);
  }, []);

  const sidebarProps = {
    history: chatHistory,
    activeId: activeConvId,
    onSelect: (id: string) => {
      loadConversation(id);
      if (window.innerWidth < 1024) setSidebarOpen(false);
    },
    onNew: () => {
      resetAll();
      if (window.innerWidth < 1024) setSidebarOpen(false);
    },
    onDelete: (id: string) => deleteConversation(id),
    onClose: () => setSidebarOpen(false),
    selectedLang,
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── Mobile backdrop ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Sidebar mobile: fixed overlay ── */}
        <div
          className={`lg:hidden fixed top-0 left-0 h-full w-72 z-40 transition-transform duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="w-72 h-full">
            <ScopeSidebar {...sidebarProps} />
          </div>
        </div>

        {/* ── Sidebar desktop: in-flow, pushes content ── */}
        <div
          className={`hidden lg:block flex-shrink-0 transition-all duration-300 ease-in-out overflow-hidden border-r border-gray-200 dark:border-gray-700 ${
            sidebarOpen ? "w-72" : "w-0"
          }`}
        >
          <div className="w-72 h-full">
            <ScopeSidebar {...sidebarProps} />
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="flex-1 flex flex-col min-w-0" style={{ background: 'linear-gradient(to bottom, #ffffff 0%, #e0f2fe 60%, #bfdbfe 100%)' }}>
          <div className="flex-1 overflow-y-auto">
            <ScopeResult />
          </div>
          <QuestionBottomSheet />
          <ScopeHeader />
        </div>
      </div>

      {/* ── Toggle tab ── */}
      <button
        onClick={() => setSidebarOpen((o) => !o)}
        style={{ left: sidebarOpen ? "288px" : "0px" }}
        className={`fixed top-1/2 -translate-y-1/2 z-50 cursor-pointer flex flex-col items-center justify-center gap-1.5 py-5 px-1.5 bg-white dark:bg-gray-800 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl shadow-md transition-all duration-300 ${
          sidebarOpen
            ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30"
            : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        }`}
        title={
          sidebarOpen
            ? (selectedLang === "IDN" ? "Tutup riwayat" : "Close history")
            : (selectedLang === "IDN" ? "Buka riwayat" : "Open history")
        }
      >
        <PanelLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${sidebarOpen ? "rotate-180" : ""}`} />
        <span
          className="text-[8px] font-bold tracking-widest"
          style={{ writingMode: "vertical-rl" }}
        >
          {sidebarOpen
            ? (selectedLang === "IDN" ? "TUTUP" : "CLOSE")
            : (selectedLang === "IDN" ? "RIWAYAT" : "HISTORY")}
        </span>
      </button>
    </div>
  );
};
