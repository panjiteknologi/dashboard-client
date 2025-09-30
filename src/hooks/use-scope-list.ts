import { createQueryHook } from "@/lib/create-api-hooks";
import { dataScopeListServices } from "@/services/data-scope-list";

export type ScopeListItem = { id: string; title: string };
export type ScopeListResponse = {
  status: string;
  total: number;
  data: ScopeListItem[];
};

const dataScopeListKeys = {
  scopeList: () => ["scopeList"] as const,
};

export const useScopeListQuery = createQueryHook<void, ScopeListResponse>(
  dataScopeListKeys.scopeList,
  () => dataScopeListServices.getDataScopeList()
);
