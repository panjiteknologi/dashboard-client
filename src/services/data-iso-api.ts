import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataISOService = {
  async getDataISO({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/iso?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async getDetailISO({ id }: { id: number }) {
    const response = await apiClient.get(`${baseUrl}/api/client/iso/${id}`);
    return response.data;
  },
};
