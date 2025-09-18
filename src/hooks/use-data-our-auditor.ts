import { createQueryHook } from "@/lib/create-api-hooks";
import { dataOurAuditorService } from "@/services/data-our-auditor";

const dataOurAuditorKeys = {
  details: () => ["detail"] as const,
};

export const useDataOurAuditorQuery = createQueryHook(
  dataOurAuditorKeys.details,
  dataOurAuditorService.getDataOurAuditor
);
