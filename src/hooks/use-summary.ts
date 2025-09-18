import { createQueryHook } from "@/lib/create-api-hooks";
import { dataSummaryService } from "@/services/data-summary";

const dataSummaryKeys = {
  details: () => ["detail"] as const,
};

export const useSummaryQuery = createQueryHook(
  dataSummaryKeys.details,
  dataSummaryService.getDataSummary
);
