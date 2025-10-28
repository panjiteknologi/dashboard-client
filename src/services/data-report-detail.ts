import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export const dataReportDetailServices = {
  async getDataReportDetail({ id }: { id: number }) {
    const response = await apiClient.get(`${baseUrl}/api/client/audit_reports/${id}`);
    return response.data;
  },
};
