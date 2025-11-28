import { env } from "@/env";
import apiClient from "@/lib/api-client";

const baseUrl = env.NEXT_PUBLIC_ENDPOINT_URL;

export type CreateAuditRequestPayloadTypes = {
  iso_standard_ids: string[];
  tgl_perkiraan_audit_selesai: string;
  audit_stage: string;
  notes?: string;
};

export const dataAuditRequestServices = {
  async getDataAuditRequest({ page, limit }: { page: number; limit: number }) {
    const response = await apiClient.get(
      `${baseUrl}/api/client/audit-request?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  async postDataAuditRequest(payload: CreateAuditRequestPayloadTypes) {
    const response = await apiClient.post(
      `${baseUrl}/api/client/audit-request`,
      payload
    );
    return response.data;
  },
};
