import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataSummaryService = {
  async getDataSummary() {
    const response = await apiClient.get(
      `${baseUrl}/api/client/dashboard/summary`
    );
    return response.data;
  },
};
