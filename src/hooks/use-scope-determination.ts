import { useState, useCallback } from 'react';

// interface ScopeDeterminationRequest {
//   query: string;
// }

interface ScopeDeterminationResponse {
  hasil_pencarian: string[];
  penjelasan: string;
  saran: string;
  detail_scope: Array<{
    key: string;
    standar: string;
    description: string | null;
    scope: unknown[];
    // scope: any[];
  }>;
  query: string;
  raw_ai_response?: string;
}

interface UseScopeDeterminationResult {
  isLoading: boolean;
  error: string | null;
  response: ScopeDeterminationResponse | null;
  determinateScope: (query: string) => Promise<void>;
  reset: () => void;
}

export const useScopeDetermination = (): UseScopeDeterminationResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<ScopeDeterminationResponse | null>(null);

  const determinateScope = useCallback(async (query: string) => {
    if (!query.trim()) {
      setError('Query cannot be empty');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/scope-determination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data: ScopeDeterminationResponse = await res.json();
      setResponse(data);

      // Log response to console as requested
      console.group('🔍 Scope Determination Result');
      console.log('Query:', data.query);
      console.log('Hasil Pencarian:', data.hasil_pencarian);
      console.log('Penjelasan:', data.penjelasan);
      console.log('Saran:', data.saran);
      console.log('Detail Scope:', data.detail_scope);
      if (data.raw_ai_response) {
        console.log('Raw AI Response:', data.raw_ai_response);
      }
      console.groupEnd();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Scope Determination Error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResponse(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    response,
    determinateScope,
    reset,
  };
};