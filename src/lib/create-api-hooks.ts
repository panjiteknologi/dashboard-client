import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

type ApiFunction<TParams, TResponse> = (params: TParams) => Promise<TResponse>;
type MutationFunction<TParams, TResponse> = (
  params: TParams
) => Promise<TResponse>;

// Create a factory for generating query hooks
export function createQueryHook<TParams, TResponse>(
  queryKeyFn: (params: TParams) => QueryKey,
  apiFn: ApiFunction<TParams, TResponse>
) {
  return (
    params: TParams,
    options?: Omit<
      UseQueryOptions<TResponse, AxiosError, TResponse, QueryKey>,
      "queryKey" | "queryFn"
    >
  ) => {
    return useQuery({
      queryKey: queryKeyFn(params),
      queryFn: () => apiFn(params),
      ...options,
    });
  };
}

// Create a factory for generating mutation hooks
export function createMutationHook<TParams, TResponse>(
  apiFn: MutationFunction<TParams, TResponse>,
  options: {
    onSuccessMessage?: string;
    onErrorMessage?: string;
    invalidateQueries?: (
      queryClient: ReturnType<typeof useQueryClient>,
      params: TParams
    ) => void;
  } = {}
) {
  return (
    mutationOptions?: Omit<
      UseMutationOptions<TResponse, AxiosError, TParams, unknown>,
      "mutationFn"
    >
  ) => {
    const queryClient = useQueryClient();

    return useMutation<TResponse, AxiosError, TParams, unknown>({
      mutationFn: apiFn,
      onSuccess: (data, variables, onMutateResult, context) => {
        if (options.invalidateQueries) {
          options.invalidateQueries(queryClient, variables);
        }

        if (options.onSuccessMessage) {
          toast.success(options.onSuccessMessage);
        }

        // teruskan ke onSuccess custom dari pemanggil (kalau ada)
        mutationOptions?.onSuccess?.(data, variables, onMutateResult, context);
      },
      onError: (error, variables, onMutateResult, context) => {
        toast.error(
          options.onErrorMessage ||
            (error.response?.data as { message?: string })?.message ||
            "An error occurred"
        );

        // teruskan ke onError custom dari pemanggil (kalau ada)
        mutationOptions?.onError?.(error, variables, onMutateResult, context);
      },
      ...mutationOptions,
    });
  };
}
