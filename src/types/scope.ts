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
};
