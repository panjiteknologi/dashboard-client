/* eslint-disable @typescript-eslint/no-explicit-any */
import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export type CreateCRMPayloadTypes = {
  iso_standard_ids: string[];
  audit_stage: string;
  tahapan_audit: string;
  accreditation: any;
};

export const dataCRMServices = {
  async getDataCRM({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/crm-lanjut?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async postDataCRM(payload: CreateCRMPayloadTypes) {
    const response = await apiClient.post(
      `${baseUrl}/api/client/crm-loss`,
      payload
    );
    return response.data;
  },

  async deleteDataCRM(id: number) {
    const response = await apiClient.post(
      `${baseUrl}/api/client/crm-lanjut/${id}`
    );
    return response.data;
  },
};
