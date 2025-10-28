import { createQueryHook } from "@/lib/create-api-hooks";
import { dataReportDetailServices } from "@/services/data-report-detail";

const dataReportDetailKey = {
  report: (params: { id: number }) => ["report", params.id] as const,
};

export const useDataReportDetailQuery = createQueryHook(
  dataReportDetailKey.report,
  (params: { id: number }) => dataReportDetailServices.getDataReportDetail(params)
);
