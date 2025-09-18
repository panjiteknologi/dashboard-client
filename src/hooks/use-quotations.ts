"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { dataQuotationsServices } from "@/services/data-quotations";

export const keys = {
  list: (page: number, limit: number) => ["iso", "list", page, limit] as const,
};

export function useQuotationsQuery({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: keys.list(page, limit),
    queryFn: () => dataQuotationsServices.getDataQuotations({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
