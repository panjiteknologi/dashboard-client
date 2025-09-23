import { createQueryHook } from "@/lib/create-api-hooks";
import { dataSummaryService } from "@/services/data-summary";

const dataSummaryKeys = {
  summary: () => ["summary"] as const,
};

export const useSummaryQuery = createQueryHook(
  dataSummaryKeys.summary,
  dataSummaryService.getDataSummary
);
