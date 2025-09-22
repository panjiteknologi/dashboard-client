import { createQueryHook } from "@/lib/create-api-hooks";
import { dataDashboardService } from "@/services/data-dashboard";

const dataDashboardKeys = {
  details: () => ["detail"] as const,
};

export const useDashboardQuery = createQueryHook(
  dataDashboardKeys.details,
  dataDashboardService.getDataDashboard
);
