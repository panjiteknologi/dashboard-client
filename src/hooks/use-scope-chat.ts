import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ChatPhase, ScopeDeterminationResponse } from '@/types/scope';
import { formatScopeMessage, ScopeData } from '@/lib/scope-formatter';

interface UseScopeChatResult {
  chatMessages: ChatMessage[];
  chatPhase: ChatPhase;
  isChatLoading: boolean;
  isScopeLoading: boolean;
  chatError: string | null;
  chatScopeData: ScopeDeterminationResponse | null;
  chatKeywords: string | null;
  sendChatMessage: (content: string, selectedLang?: 'IDN' | 'EN') => Promise<void>;
  editChatMessage: (idx: number, newContent: string, selectedLang?: 'IDN' | 'EN') => Promise<void>;
  resendChatMessage: (idx: number, selectedLang?: 'IDN' | 'EN') => Promise<void>;
  loadMessages: (messages: ChatMessage[], keywords: string | null) => void;
  resetChat: () => void;
  stopChat: () => void;
}

export const useScopeChat = (): UseScopeChatResult => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatPhase, setChatPhase] = useState<ChatPhase>('idle');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isScopeLoading, setIsScopeLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [chatScopeData, setChatScopeData] = useState<ScopeDeterminationResponse | null>(null);
  const [chatKeywords, setChatKeywords] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const callAPI = useCallback(
    async (messagesToSend: ChatMessage[], selectedLang: 'IDN' | 'EN') => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsChatLoading(true);
      setChatError(null);

      try {
        // ── Phase 1: get AI conversational response ──────────────────────────
        const res = await fetch('/api/scope-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: messagesToSend }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Unknown error' }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const chatText: string = data.chat_message ?? data.message ?? '';

        // Show AI text immediately
        const assistantMessage: ChatMessage = { role: 'assistant', content: chatText };
        setChatMessages((prev) => [...prev, assistantMessage]);
        setChatPhase('asking');
        setIsChatLoading(false);

        // ── Phase 2: attach scope results ────────────────────────────────────
        const lang: 'IDN' | 'EN' = data.scope_query?.lang ?? 'IDN';
        const isIDN = lang === 'IDN';
        const followUp = isIDN
          ? '\n\n---\n💬 Apakah scope sertifikasi di atas sesuai dengan bisnis Anda? Jika ada pertanyaan atau ingin mencari scope lain, silakan tanyakan.'
          : '\n\n---\n💬 Does the certification scope above match your business? Feel free to ask if you have questions or want to search for a different scope.';

        if (data.scope_results?.hasil_pencarian?.length > 0) {
          // Fast path: IAF codes extracted from AI text — results already available, no second API call
          const scopeMsg = formatScopeMessage(data.scope_results as ScopeData, isIDN) + followUp;
          setChatMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === 'assistant') {
              updated[updated.length - 1] = { ...last, scope_message: scopeMsg, scope_data: data.scope_results };
            }
            return updated;
          });
          if (data.keywords_used) setChatKeywords(data.keywords_used);

        } else if (data.scope_query) {
          // Slow path: no IAF codes extracted — call scope-determination API
          const { query } = data.scope_query as { query: string; lang: 'IDN' | 'EN' };
          setIsScopeLoading(true);
          try {
            const scopeRes = await fetch('/api/scope-determination', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ query, selectedLang: lang }),
              signal: controller.signal,
            });

            const scopeData: ScopeData | null = scopeRes.ok ? await scopeRes.json() : null;
            const scopeMsg = formatScopeMessage(scopeData, isIDN) + followUp;

            setChatMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last?.role === 'assistant') {
                updated[updated.length - 1] = { ...last, scope_message: scopeMsg, scope_data: scopeData as ScopeDeterminationResponse | null };
              }
              return updated;
            });

            if (data.keywords_used) setChatKeywords(data.keywords_used);
          } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') return;
          } finally {
            setIsScopeLoading(false);
          }

        } else if (data.keywords_used) {
          setChatKeywords(data.keywords_used);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setChatError(err instanceof Error ? err.message : 'Unexpected error');
        setIsChatLoading(false);
        setIsScopeLoading(false);
      }
    },
    []
  );

  const sendChatMessage = useCallback(
    async (content: string, selectedLang: 'IDN' | 'EN' = 'IDN') => {
      if (!content.trim()) return;
      const userMessage: ChatMessage = { role: 'user', content: content.trim() };
      const updatedMessages = [...chatMessages, userMessage];
      setChatMessages(updatedMessages);
      await callAPI(updatedMessages, selectedLang);
    },
    [chatMessages, callAPI]
  );

  const editChatMessage = useCallback(
    async (idx: number, newContent: string, selectedLang: 'IDN' | 'EN' = 'IDN') => {
      if (!newContent.trim()) return;
      const editedMessage: ChatMessage = { role: 'user', content: newContent.trim() };
      const updatedMessages = [...chatMessages.slice(0, idx), editedMessage];
      setChatMessages(updatedMessages);
      setChatKeywords(null);
      setChatScopeData(null);
      await callAPI(updatedMessages, selectedLang);
    },
    [chatMessages, callAPI]
  );

  const resendChatMessage = useCallback(
    async (idx: number, selectedLang: 'IDN' | 'EN' = 'IDN') => {
      const updatedMessages = chatMessages.slice(0, idx + 1);
      setChatMessages(updatedMessages);
      setChatKeywords(null);
      setChatScopeData(null);
      await callAPI(updatedMessages, selectedLang);
    },
    [chatMessages, callAPI]
  );

  const loadMessages = useCallback((messages: ChatMessage[], keywords: string | null) => {
    setChatMessages(messages);
    setChatPhase(messages.length > 0 ? 'asking' : 'idle');
    setChatKeywords(keywords);
    setChatScopeData(null);
    setIsChatLoading(false);
    setIsScopeLoading(false);
    setChatError(null);
  }, []);

  const stopChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsChatLoading(false);
    setIsScopeLoading(false);
  }, []);

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setChatMessages([]);
    setChatPhase('idle');
    setIsChatLoading(false);
    setIsScopeLoading(false);
    setChatError(null);
    setChatScopeData(null);
    setChatKeywords(null);
  }, []);

  return {
    chatMessages,
    chatPhase,
    isChatLoading,
    isScopeLoading,
    chatError,
    chatScopeData,
    chatKeywords,
    sendChatMessage,
    editChatMessage,
    resendChatMessage,
    loadMessages,
    resetChat,
    stopChat,
  };
};
