import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataAuditPlanService = {
  async getDataAuditPlan() {
    const response = await apiClient.get(`${baseUrl}/api/client/audit-plan`);

    return response.data;
  },
};
