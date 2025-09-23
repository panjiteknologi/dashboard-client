import { createQueryHook } from "@/lib/create-api-hooks";
import { dataAuditorsService } from "@/services/data-auditors";

const dataAuditorsKeys = {
  auditors: () => ["auditors"] as const,
};

export const useAuditorsQuery = createQueryHook(
  dataAuditorsKeys.auditors,
  dataAuditorsService.getDataAuditors
);
