"use client";

import {
  CreateAuditRequestPayloadTypes,
  dataAuditRequestServices,
} from "@/services/data-audit-request";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const keys = {
  list: (page: number, limit: number) =>
    ["audit-request", "list", page, limit] as const,
  create: ["audit-request", "create"] as const,
};

export function useAuditRequestQuery({
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
      dataAuditRequestServices.getDataAuditRequest({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled,
  });
}

export function useAuditRequestCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys.create,
    mutationFn: (payload: CreateAuditRequestPayloadTypes) =>
      dataAuditRequestServices.postDataAuditRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["audit-request", "list"],
      });
    },
  });
}
