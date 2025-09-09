"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { dataISOService } from "@/services/data-iso-api";

export const isoKeys = {
  list: (page: number, limit: number) => ["iso", "list", page, limit] as const,
  detail: (id: number) => ["iso", "detail", id] as const,
  section: (id: number, section: string) =>
    ["iso", "section", id, section] as const,
};

export function useISOListQuery({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: isoKeys.list(page, limit),
    queryFn: () => dataISOService.getDataISO({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
  });
}

export function useISODetailQuery(id?: number, enabled = true) {
  return useQuery({
    queryKey: id ? isoKeys.detail(id) : ["iso", "detail", "missing"],
    queryFn: () => dataISOService.getDetailISO({ id: id! }),
    enabled: Boolean(id && enabled),
    staleTime: 5 * 60 * 1000,
  });
}

export function useISOSectionQuery(
  id?: number,
  section?: string,
  enabled = true
) {
  return useQuery({
    queryKey:
      id && section
        ? isoKeys.section(id, section)
        : ["iso", "section", "missing"],
    queryFn: () =>
      dataISOService.getSectionISO({ id: id!, sections: section! }),
    enabled: Boolean(id && section && enabled),
    staleTime: 5 * 60 * 1000,
  });
}
