import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataScopeListServices = {
  async getDataScopeList() {
    const response = await apiClient.get(`${baseUrl}/api/client/scope-list`);
    return response.data;
  },
};
