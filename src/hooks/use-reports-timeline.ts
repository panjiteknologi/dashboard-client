import { createQueryHook } from "@/lib/create-api-hooks";
import { reportsTimelineService } from "@/services/data-reports-timeline";

export const chartsKeys = {
  reportsTimeline: (from: string, to: string) =>
    ["charts", "reports_timeline", from, to] as const,
};

export const useReportsTimelineQuery = createQueryHook(
  chartsKeys.reportsTimeline,
  reportsTimelineService.getReportsTimeline
);
