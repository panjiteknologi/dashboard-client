export interface OurAuditorProject {
  plan_id: number;
  document_no: string;
  customer_name: string;
  iso_standards: string[];
  audit_stage: string;
  audit_date?: string;
  certification_type?: string;
  audit_method?: string;
  scope?: string;
  state?: string;
  audit_start?: string;
  audit_end?: string;
  contact_person?: string;
  auditor_role?: string;
}

export interface OurAuditor {
  id: number;
  name: string;
  projects: OurAuditorProject[];
}

export interface AllOurAuditor {
  data: {
    auditors: OurAuditor[];
  };
}
