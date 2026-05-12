import { useState, useCallback, useRef } from 'react';
import { ChatMessage, ChatPhase, ScopeDeterminationResponse } from '@/types/scope';

interface UseScopeChatResult {
  chatMessages: ChatMessage[];
  chatPhase: ChatPhase;
  isChatLoading: boolean;
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
        const assistantMessage: ChatMessage = { role: 'assistant', content: data.message || '' };
        setChatMessages((prev) => [...prev, assistantMessage]);
        setChatPhase(data.phase === 'complete' ? 'complete' : 'asking');
        if (data.phase === 'complete') {
          setChatScopeData(data.scope_data || null);
          setChatKeywords(data.keywords_used || null);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        setChatError(err instanceof Error ? err.message : 'Unexpected error');
      } finally {
        setIsChatLoading(false);
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

  // Edit message at idx: replace it with new content, drop everything after, re-ask
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

  // Resend message at idx: keep everything up to and including it, drop AI reply after, re-ask
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
    setChatError(null);
  }, []);

  const stopChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsChatLoading(false);
  }, []);

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setChatMessages([]);
    setChatPhase('idle');
    setIsChatLoading(false);
    setChatError(null);
    setChatScopeData(null);
    setChatKeywords(null);
  }, []);

  return {
    chatMessages,
    chatPhase,
    isChatLoading,
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
