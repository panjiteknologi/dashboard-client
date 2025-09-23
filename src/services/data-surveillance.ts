import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataSurveillanceServices = {
  async getDataSurveillance({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/reminder-surveillance?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
