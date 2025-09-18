"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { dataPaymentsServices } from "@/services/data-payments";

export const keys = {
  list: (page: number, limit: number) => ["iso", "list", page, limit] as const,
};

export function usePaymentsQuery({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: keys.list(page, limit),
    queryFn: () => dataPaymentsServices.getDataPayments({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}
