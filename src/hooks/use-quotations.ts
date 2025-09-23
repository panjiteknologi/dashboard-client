import { dataQuotationsServices } from "@/services/data-quotations";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

export const keys = {
  list: (page: number, limit: number) =>
    ["quotations", "list", page, limit] as const,
};

export function useQuotationsQuery({
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
    queryFn: () => dataQuotationsServices.getDataQuotations({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled,
  });
}
