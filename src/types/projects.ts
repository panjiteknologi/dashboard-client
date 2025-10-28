/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AllProject {
  [x: string]: string;
  aplication_form: string;
  iso_standards: string;
  accreditation: string;
  customer_id: string;
  customer: string;
}

export interface StandardTypes {
  standard_name: string;
}

export interface RowApplicationFormType {
  id: any;
  hotel?: string;
  remarks?: string;
  contact_phone?: string;
  scope?: string;
  boundaries?: string;
  document_no?: string;
  customer_name?: string;
  issued_date?: string;
  standards?: string[];
  created_by?: string;
  status_app_form?: string;
  status_sales?: string;
  audit_status?: string;
  office_address?: string;
  contact_person?: string;
  position?: string;
  fax?: string;
  email?: string;
  website?: string;
  invoicing_address?: string;
  sale_order?: string;
  audit_stage?: string;
  certification?: string;
  number_of_site?: number | string;
  attachment?: string;
  segment?: string;
  declaration?: string;
  sales_person?: string;
  category?: string;
  signature?: string;
  created_by_full?: string;
  transport_by?: string;
  integreted_audit?: string;
  integrated_audit?: string;
  accreditation?: string;
  iaf_code?: string | string[];
  complexity?: string;
  mandatory_sni?: string;
  available_sections?: string[];
}

export interface AllApplicationFormType {
  id: number;
  name: string;
  customer?: { id: number; name: string } | null;
  issued_date?: string | null;
  iso_standard_ids?:
    | { id: number; name: string; code?: string | null }[]
    | null;
  user_id?: { id: number; name: string } | null;
  state?: string | null;
  state_sales?: string | null;
  audit_status?: string | null;
}

export interface ApplicationFormDetailType {
  id?: number;
  available_sections?: string[];
  office_address?: string;
  invoicing_address?: string;
  contact_person?: string;
  contact_phone?: string;
  position?: string;
  fax?: string;
  email?: string;
  website?: string;
  sale_order?: string;

  audit_stage?: string;
  certification?: string;
  number_of_site?: number | string;
  remarks?: string;
  attachment?: string;

  segment?: string;
  category?: string;
  declaration?: string;
  signature?: string;
  sales_person?: string;
  created_by_full?: string;
  hotel?: string;
  transport_by?: string;

  integrated_audit?: string;
  integreted_audit?: string;

  accreditation?: string;
  iaf_code?:
    | string
    | string[]
    | Array<{ id?: number | string; name?: string; code?: string }>;
  complexity?: string;
  mandatory_sni?: string;
}

export interface DocumentAudit {
  audit_plan: string;
  attendance_sheet: string;
  audit_report: string;
  close_findings: string;
}

export interface LogNote {
  author: string;
  note: string;
  timestamp: string;
}

export interface CapaTypes {
  id?: number;
  document_no: string;
  customer: string;
  reference: string;
  standards: string[];
  audit_stage: string | null;
  status: string;
  category?: string;
  plan_reference?: string;
  sales_order?: string;
  total_employee?: number;
  boundaries?: string;
  finding_type?: string;
  scope?: string;
  document_audit?: DocumentAudit | any;
  log_notes?: LogNote[] | any;
}

export interface PlanTypes {
  document_no: string;
  customer: string;
  standards?: string[];
  reference?: string;
  contract_number?: string;
  contract_date?: string;
  scope?: string;
  boundaries?: string;
  contact_person?: string;
  contact_phone?: string;
  iaf_code?: string;
  certification_type?: string;
  audit_stage?: string;
  audit_start?: string;
  audit_end?: string;
  audit_method?: string;
  lead_auditor?: string;
  technical_expert?: string;
  auditor1?: string;
  auditor2?: string;
  auditor3?: string;
  document_audit?: {
    audit_plan?: string;
    attendance_sheet?: string;
    audit_report?: string;
    close_findings?: string;
  };
  log_notes?: LogNote[] | any;
  category: string;
  status: string;
}

export interface RegulationType {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  number: string;
  type: string;
  issuer: string;
  sector: string;
  jurisdiction: string;
  status: "Berlaku" | "Dicabut" | "Draft";
  publishedAt: string;
  effectiveAt: string;
  summary: string;
  keywords?: string[];
  sourceUrl?: string;
  attachments?: {
    filename: string;
    url: string;
  }[];
  sections?: {
    title: string;
    description: string;
  }[];
  relatedRegulations?: {
    id: number;
    title: string;
  }[];
}

export interface ReportList {
  id: number;
  name: string;
  customer: {
    id: number;
    name: string;
  } | null;
  iso_reference: {
    id: number;
    name: string;
  } | null;
  iso_standards_ids: {
    id: number;
    name: string;
  }[];
  audit_stage: string;
  state: string;

  // From log, but not in old type
  closing_finding_date?: string;
  finding_major?: number;
  finding_minor?: number;
  finding_ofi?: number;
  finding_status?: string;

  // From old type, but not in log. Keep as optional.
  audit_plan_file_name?: string;
  attendance_sheet_file_name?: string;
  audit_report_file_name?: string;
  capa_file_name?: string;
  log_notes?: any;
}

export interface WebinarsType {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  students: number;
  sessions: number; // ganti dari chapters
  time: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  author: string;
  modules: {
    title: string;
    duration: string;
    isFree: boolean;
  }[];
  relatedWebinars?: {
    title: string;
    price: string;
    thumbnail: string;
  }[];
}
