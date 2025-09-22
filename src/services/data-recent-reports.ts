import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataRecentReportsServices = {
  async getDataRecentReports({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/dashboard/tables/recent_reports?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
