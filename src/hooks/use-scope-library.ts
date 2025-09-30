import { createQueryHook } from "@/lib/create-api-hooks";
import {
  dataScopeLibraryServices,
  ScopeLibraryParams,
} from "@/services/data-scope-library";

export type ScopeLibraryRecord = {
  id: string;
  title: string;
  items: string[];
  description: string | null;
};
export type ScopeLibraryResponse = {
  status: string;
  total: number;
  filters: { scope?: string[]; search?: string };
  data: ScopeLibraryRecord[];
};

const scopeLibraryKeys = {
  scopeLibrary: (p: ScopeLibraryParams = {}) =>
    [
      "scopeLibrary",
      p.page ?? 1,
      p.limit ?? 10,
      p.search ?? "",
      p.scope ?? "",
    ] as const,
};

export const useScopeLibraryQuery = createQueryHook<
  ScopeLibraryParams,
  ScopeLibraryResponse
>(scopeLibraryKeys.scopeLibrary, dataScopeLibraryServices.getScopeLibrary);
