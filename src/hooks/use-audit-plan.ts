import { createQueryHook } from "@/lib/create-api-hooks";
import { dataAuditPlanService } from "@/services/data-audit-plan";

const dataAuditPlanKeys = {
  details: () => ["detail"] as const,
};

export const useAuditPlanQuery = createQueryHook(
  dataAuditPlanKeys.details,
  dataAuditPlanService.getDataAuditPlan
);
