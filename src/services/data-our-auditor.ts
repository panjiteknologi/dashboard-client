import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataOurAuditorService = {
  async getDataOurAuditor() {
    const response = await apiClient.get(`${baseUrl}/api/client/our-auditor`);
    return response.data;
  },
};
