import { createQueryHook } from "@/lib/create-api-hooks";
import { reportsTimelineService } from "@/services/data-reports-timeline";

const parseRange = (range: string) => {
  const [from, to] = (range ?? "").split(":");
  return { from, to };
};

export const chartsKeys = {
  reportsTimeline: (range: string) =>
    ["charts", "reports_timeline", range] as const,
};

export const useReportsTimelineQuery = createQueryHook(
  chartsKeys.reportsTimeline,
  (range: string) => {
    const { from, to } = parseRange(range);
    return reportsTimelineService.getReportsTimeline(from, to);
  }
);
