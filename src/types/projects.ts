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

export interface AllApplicationFormType {
  partner_name: string | undefined;
  office_address: string;
  invoice_address: string;
  contact_person: string;
  phone: string;
  departement: string;
  email: string;
  website: string;
  tahapan: string;
  standards: string[];
  created_at: string;
  updated_at: string;

  // Detail fields
  scope?: string;
  boundaries?: string;
  iso_standard?: string;
  certificate_type?: string;
  audit_stage?: string;
  number_of_site?: number;
  remarks?: string;

  // Personal Situation 1–3
  type_1?: string;
  address_1?: string;
  activity_1?: string;
  employees_1?: number;

  type_2?: string;
  address_2?: string;
  activity_2?: string;
  employees_2?: number;

  type_3?: string;
  address_3?: string;
  activity_3?: string;
  employees_3?: number;
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
  students: number;
  chapters: number;
  time: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  author: string;
  modules: {
    title: string;
    duration: string;
    isFree: boolean;
  }[];
  relatedCourses?: {
    title: string;
    price: string;
    thumbnail: string;
  }[];
}

export interface WebinarsType {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  students: number;
  chapters: number;
  time: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  author: string;
  modules: {
    title: string;
    duration: string;
    isFree: boolean;
  }[];
  relatedCourses?: {
    title: string;
    price: string;
    thumbnail: string;
  }[];
}
