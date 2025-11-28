"use client";

import { CreateCRMPayloadTypes, dataCRMServices } from "@/services/data-crm";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const keys = {
  list: (page: number, limit: number) => ["crm", "list", page, limit] as const,
  create: ["crm", "create"] as const,
  delete: ["crm", "delete"] as const,
};

export function useCRMQuery({
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
    queryFn: () => dataCRMServices.getDataCRM({ page, limit }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
    enabled,
  });
}

export function useACRMCreateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys.create,
    mutationFn: (payload: CreateCRMPayloadTypes) =>
      dataCRMServices.postDataCRM(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crm", "list"],
      });
    },
  });
}

export function useCRMDeleteMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: keys.delete,
    mutationFn: (id: number) => dataCRMServices.deleteDataCRM(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["crm", "list"],
      });
    },
  });
}
