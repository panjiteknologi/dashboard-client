import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataDashboardService = {
  async getDataDashboard() {
    const response = await apiClient.get(`${baseUrl}/api/client/dashboard`);

    return response.data;
  },
};
