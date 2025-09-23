import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataAuditorsService = {
  async getDataAuditors() {
    const response = await apiClient.get(
      `${baseUrl}/api/client/dashboard/tables/auditors`
    );

    return response.data;
  },
};
