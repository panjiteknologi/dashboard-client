import { createQueryHook } from "@/lib/create-api-hooks";
import { dataAuditHistoryService } from "@/services/data-audit-history";

const dataAuditHistoryKeys = {
  details: () => ["detail"] as const,
};

export const useAuditHistoryQuery = createQueryHook(
  dataAuditHistoryKeys.details,
  dataAuditHistoryService.getDataAuditHistory
);
