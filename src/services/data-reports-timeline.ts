import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export type ReportsTimelineItem = {
  period: string;
  count: number;
};

export type ReportsTimelineResponse = {
  success: boolean;
  data: ReportsTimelineItem[];
  meta: {
    key: "reports_timeline";
    from: string;
    to: string;
    partner_id: number;
  };
};

export const reportsTimelineService = {
  async getReportsTimeline(params: { from: string; to: string }) {
    const { from, to } = params;
    const url = `${baseUrl}/api/client/dashboard/charts/reports_timeline`;

    const response = await apiClient.get<ReportsTimelineResponse>(url, {
      params: { from, to },
    });

    return response.data;
  },
};
