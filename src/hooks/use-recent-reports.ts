import { dataRecentReportsServices } from "@/services/data-recent-reports";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const keys = {
  list: (page: number, limit: number) =>
    ["RecentReports", "list", page, limit] as const,
};

export function useRecentReportsQuery({
  page = 1,
  limit = 10,
  enabled = true,
}: {
  page?: number;
  limit?: number;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: keys.list(page, limit),
    queryFn: () =>
      dataRecentReportsServices.getDataRecentReports({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled,
  });
}
