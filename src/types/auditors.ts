export type Auditor = {
  id: number;
  name: string;
  job_title: string | null;
  work_email: string | null;
  work_phone: string | null;
  mobile: string | null;
  roles: string[];
  projects_count: number;
  last_audit_start: string | null;
  last_audit_end: string | null;
  iso_standards: string[];
};

export type AuditorsMeta = {
  key: string;
  limit: number;
  offset: number;
};

export type AuditorsResponse = {
  success: boolean;
  data: Auditor[];
  meta: AuditorsMeta;
};

export type AuditorsParams = {
  q?: string;
  role?: string;
  iso?: string;
  limit?: number;
  offset?: number;
};
