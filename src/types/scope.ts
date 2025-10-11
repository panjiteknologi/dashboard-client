export type ScopeLibraryItem = {
  id: string;
  code?: string;
  name: string;
};

export type ScopeLibraryResponse = {
  data: ScopeLibraryItem[];
  meta: { page: number; limit: number; total: number };
};

export type ScopeLibraryParams = {
  page?: number;
  limit?: number;
  search?: string;
  scope?: string;
};

export type ScopeROW = { idx: number; code: string | null; label: string; title?: string; };

export type ScopeItem = { id: string; title: string };

export type ScopeDeterminationResponse = {
  hasil_pencarian: Array<{
    scope_key: string;
    standar: string;
    iaf_code: string;
    nace: {
      code: string;
      description: string;
    };
    nace_child: {
      code: string;
      title: string;
    };
    nace_child_details: Array<{
      code: string;
      title: string;
      description: string;
    }>;
    relevance_score: number;
  }>;
  penjelasan: string;
  saran: string;
  total_hasil: number;
  query: string;
  corrected_query?: string;
  raw_ai_response?: string;
};

export type ScopeCTX = {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  debounced: string;
  searchRef: React.MutableRefObject<HTMLInputElement | null>;
  quick: string[];
  showCodes: boolean;
  setShowCodes: React.Dispatch<React.SetStateAction<boolean>>;
  scopes: ScopeItem[];
  scopeId: string;
  setScopeId: React.Dispatch<React.SetStateAction<string>>;
  scopeLabel: string;
  isLoadingChips: boolean;
  isLoadingList: boolean;
  shouldQuery: boolean;
  rows: ScopeROW[];
  total: number;
  totalPages: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageSize: number;
  highlight: (text: string, q: string) => React.ReactNode;
  exportCsv: (rows: ScopeROW[]) => void;
  // AI Scope Determination
  aiResponse: ScopeDeterminationResponse | null;
  isLoadingAI: boolean;
  aiError: string | null;
  determinateScope: (query: string) => Promise<void>;
  resetAI: () => void;
};
