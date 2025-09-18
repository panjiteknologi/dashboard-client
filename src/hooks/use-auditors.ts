import { createQueryHook } from "@/lib/create-api-hooks";
import { dataAuditorsService } from "@/services/data-auditors";

const dataAuditorsKeys = {
  details: () => ["detail"] as const,
};

export const useAuditorsQuery = createQueryHook(
  dataAuditorsKeys.details,
  dataAuditorsService.getDataAuditors
);
