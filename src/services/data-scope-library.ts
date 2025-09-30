import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export type ScopeLibraryParams = {
  page?: number;
  limit?: number;
  search?: string;
  scope?: string;
};

export const dataScopeLibraryServices = {
  async getScopeLibrary(params: ScopeLibraryParams = {}) {
    const { page = 1, limit = 10, search, scope } = params;

    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("limit", String(limit));
    if (search && search.trim()) qs.set("search", search.trim());
    if (scope && scope.trim()) qs.set("scope", scope.trim());

    const url = `${baseUrl}/api/client/scope-library?${qs.toString()}`;
    const response = await apiClient.get(url);
    return response.data;
  },
};
