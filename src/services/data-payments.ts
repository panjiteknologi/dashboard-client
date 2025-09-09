"use client";

import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataPaymentsServices = {
  async getDataPayments({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/payments?page=${page}&limit=${limit}`
    );
    return response.data;
  },
};
