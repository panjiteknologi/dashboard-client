import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataReportListServices = {
  async getDataReportList() {
    const response = await apiClient.get(`${baseUrl}/api/client/audit_reports`);
    return response.data;
  },
};
