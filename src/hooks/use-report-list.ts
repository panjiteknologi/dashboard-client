
import { createQueryHook } from "@/lib/create-api-hooks";
import { dataReportListServices } from "@/services/data-report-list";

const dataReportListKey = {
  reports: () => ["reports"] as const,
};

export const useDataReportListQuery = createQueryHook(
  dataReportListKey.reports,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  dataReportListServices.getDataReportList
);
