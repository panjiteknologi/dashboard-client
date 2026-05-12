import { useState, useCallback, useEffect } from 'react';
import { ChatMessage } from '@/types/scope';

export type ConversationRecord = {
  id: string;
  title: string;
  messages: ChatMessage[];
  keywords: string | null;
  lang: 'IDN' | 'EN';
  createdAt: number;
  updatedAt: number;
};

const STORAGE_KEY = 'tsi-scope-history';
const MAX_RECORDS = 50;

function load(): ConversationRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConversationRecord[]) : [];
  } catch {
    return [];
  }
}

function persist(records: ConversationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.slice(0, MAX_RECORDS)));
  } catch {}
}

function makeTitle(messages: ChatMessage[]): string {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'Percakapan baru';
  return first.content.length > 48
    ? first.content.slice(0, 48) + '…'
    : first.content;
}

export function useChatHistory() {
  const [history, setHistory] = useState<ConversationRecord[]>([]);

  useEffect(() => {
    setHistory(load());
  }, []);

  const upsert = useCallback(
    (
      messages: ChatMessage[],
      keywords: string | null,
      lang: 'IDN' | 'EN',
      existingId: string | null
    ): string => {
      const now = Date.now();
      const id = existingId ?? `chat-${now}`;
      const title = makeTitle(messages);

      setHistory((prev) => {
        const idx = prev.findIndex((c) => c.id === id);
        let next: ConversationRecord[];
        if (idx >= 0) {
          next = prev.map((c) =>
            c.id === id ? { ...c, title, messages, keywords, lang, updatedAt: now } : c
          );
        } else {
          const record: ConversationRecord = {
            id, title, messages, keywords, lang, createdAt: now, updatedAt: now,
          };
          next = [record, ...prev];
        }
        persist(next);
        return next;
      });

      return id;
    },
    []
  );

  const remove = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    persist([]);
  }, []);

  return { history, upsert, remove, clearAll };
}
