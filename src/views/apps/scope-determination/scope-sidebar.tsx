"use client";

import { useState } from "react";
import { MessageSquare, Plus, Trash2, X, Clock, Sparkles } from "lucide-react";
import { ConversationRecord } from "@/hooks/use-chat-history";

function relativeDate(ts: number): string {
  const now = Date.now();
  const diff = now - ts;
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Hari ini";
  if (d === 1) return "Kemarin";
  if (d < 7) return `${d} hari lalu`;
  if (d < 30) return `${Math.floor(d / 7)} minggu lalu`;
  return `${Math.floor(d / 30)} bulan lalu`;
}

function groupByDate(history: ConversationRecord[]): { label: string; items: ConversationRecord[] }[] {
  const groups: Map<string, ConversationRecord[]> = new Map();
  for (const rec of history) {
    const label = relativeDate(rec.updatedAt);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(rec);
  }
  return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

interface Props {
  history: ConversationRecord[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  selectedLang: "IDN" | "EN";
}

export const ScopeSidebar = ({
  history,
  activeId,
  onSelect,
  onNew,
  onDelete,
  onClose,
  selectedLang,
}: Props) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const groups = groupByDate(history);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-72 flex-shrink-0 bg-white dark:bg-slate-900">

      {/* Brand header */}
      <div className="relative px-4 pt-5 pb-4 overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-blue-200/40 dark:bg-blue-700/20 blur-xl" />
        <div className="absolute top-2 right-2 w-10 h-10 rounded-full bg-sky-300/30 dark:bg-sky-600/20 blur-md" />

        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/tsi-logo.png" alt="TSI" className="w-7 h-7 object-contain" />
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-100 leading-tight">TSI Scope Determination</p>
              <p className="text-xs text-blue-400 dark:text-blue-500 font-medium tracking-wide">
                {selectedLang === "IDN" ? "Riwayat Sesi" : "Session History"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-blue-300 dark:text-blue-500 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* New chat button */}
      <div className="px-3 pb-3">
        <button
          onClick={onNew}
          className="cursor-pointer w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 dark:from-blue-600 dark:to-sky-600 shadow-md shadow-blue-200 dark:shadow-blue-900/40 transition-all active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" />
          {selectedLang === "IDN" ? "Percakapan Baru" : "New Conversation"}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-blue-200 dark:via-blue-800 to-transparent mb-2" />

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="relative mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-100 to-sky-100 dark:from-blue-900/50 dark:to-sky-900/50 flex items-center justify-center shadow-inner">
                <Sparkles className="h-6 w-6 text-blue-300 dark:text-blue-600" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-white dark:bg-slate-800 shadow flex items-center justify-center">
                <Clock className="h-3 w-3 text-blue-400" />
              </div>
            </div>
            <p className="text-base font-semibold text-blue-700 dark:text-blue-400 mb-1">
              {selectedLang === "IDN" ? "Belum ada riwayat" : "No history yet"}
            </p>
            <p className="text-sm text-blue-400/70 dark:text-blue-600 leading-relaxed">
              {selectedLang === "IDN"
                ? "Mulai percakapan untuk menyimpan riwayat"
                : "Start a conversation to save history"}
            </p>
          </div>
        ) : (
          groups.map(({ label, items }) => (
            <div key={label}>
              <div className="flex items-center gap-2 px-2 py-1 mb-1">
                <Clock className="h-2.5 w-2.5 text-blue-300 dark:text-blue-600" />
                <p className="text-xs font-bold uppercase tracking-widest text-blue-300 dark:text-blue-600">
                  {label}
                </p>
              </div>

              <div className="space-y-0.5">
                {items.map((rec) => {
                  const isActive = activeId === rec.id;
                  const isHovered = hoveredId === rec.id;
                  return (
                    <div
                      key={rec.id}
                      onMouseEnter={() => setHoveredId(rec.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      onClick={() => onSelect(rec.id)}
                      className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 ${
                        isActive
                          ? "bg-white dark:bg-blue-900/60 shadow-md shadow-blue-100 dark:shadow-blue-900/40 border border-blue-200 dark:border-blue-700"
                          : "hover:bg-white/70 dark:hover:bg-blue-900/30 hover:shadow-sm hover:shadow-blue-100 dark:hover:shadow-blue-900/20"
                      }`}
                    >
                      {/* Accent bar */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full bg-gradient-to-b from-blue-400 to-sky-500" />
                      )}

                      <div className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? "bg-gradient-to-br from-blue-400 to-sky-500"
                          : "bg-blue-100 dark:bg-blue-900/50 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50"
                      }`}>
                        <MessageSquare className={`h-3 w-3 ${isActive ? "text-white" : "text-blue-400 dark:text-blue-500"}`} />
                      </div>

                      <span className={`flex-1 text-[15px] truncate leading-snug font-medium ${
                        isActive
                          ? "text-blue-800 dark:text-blue-100"
                          : "text-blue-700/80 dark:text-blue-300/80"
                      }`}>
                        {rec.title}
                      </span>

                      {/* Delete button */}
                      {(isHovered || isActive) && (
                        <button
                          onClick={(e) => handleDelete(e, rec.id)}
                          title={
                            confirmDelete === rec.id
                              ? (selectedLang === "IDN" ? "Klik lagi untuk hapus" : "Click again to delete")
                              : (selectedLang === "IDN" ? "Hapus" : "Delete")
                          }
                          className={`flex-shrink-0 p-1 rounded-lg transition-all cursor-pointer ${
                            confirmDelete === rec.id
                              ? "text-red-500 bg-red-50 dark:bg-red-900/30 scale-110"
                              : "text-blue-300 dark:text-blue-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          }`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-blue-100 dark:border-blue-900/50">
        <p className="text-[9px] text-center text-blue-300 dark:text-blue-700 font-medium tracking-wide">
          TSI Certification © 2025
        </p>
      </div>
    </div>
  );
};
