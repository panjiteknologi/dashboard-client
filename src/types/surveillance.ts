import { Dispatch, SetStateAction } from "react";
import { AuditStageApi } from "./audit-request";

export type StageValue = "all" | "s1" | "s2";
export type UrgencyValue = "all" | "low" | "medium" | "high" | "critical";
export type ActionTypeCtx = "continue" | "discontinue" | null;

export type Certificate = {
  id: number;
  name: string;
  nomor_sertifikat: string;
  iso_reference?: { id: number; name: string; scope?: string | null };
  iso_standards?: { id: number; name: string }[];
  initial_date?: string | null;
  issue_date?: string | null;
  validity_date?: string | null;
  expiry_date?: string | null;
  days_until_expiry?: number | null;
  surveillance_1_date?: string | null;
  surveillance_2_date?: string | null;
  accreditation?: string | null;
  reminder_type?: string | null;
  urgency_level?: "low" | "medium" | "high" | "critical" | string | null;
  surveillance_stage?: "Surveillance 1" | "Surveillance 2" | string | null;
  status_expiry: {
    label: string;
    status: "expired" | "expiring_soon" | "still_valid";
  };
  tahapan_audit: string;
  isFetching?: boolean;
  refetch?: (v: boolean) => void;
};

export type SurveillanceType = {
  data: Certificate[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_count: number;
    limit: number;
    has_next?: boolean;
    has_previous?: boolean;
  };
  page: number;
  limit: number;
  onPageChange: (p: number) => void;
  onLimitChange: (l: number) => void;
  isLoading?: boolean;
};

export type SurveillanceCtx = {
  qInput: string;
  setQInput: Dispatch<SetStateAction<string>>;
  q: string;
  stage: StageValue;
  setStageSafe: (v: StageValue) => void;
  urgency: UrgencyValue;
  setUrgencySafe: (v: UrgencyValue) => void;
  iso: string;
  setIsoSafe: (v: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  stageTmp: StageValue;
  setStageTmp: Dispatch<SetStateAction<StageValue>>;
  urgencyTmp: UrgencyValue;
  setUrgencyTmp: Dispatch<SetStateAction<UrgencyValue>>;
  isoTmp: string;
  setIsoTmp: Dispatch<SetStateAction<string>>;
  applyDrawer: () => void;
  resetDrawer: () => void;
  hasActiveFilters: boolean;
  isoOptions: string[];
  filtered: Certificate[];
  clearAll: () => void;
  actionType: ActionTypeCtx;
  actionCert: Certificate | null;
  openAction: (cert: Certificate, type: Exclude<ActionTypeCtx, null>) => void;
  closeAction: () => void;
  submitContinue: (payload: {
    certificate: Certificate;
    requestDate: string;
    auditStage: AuditStageApi;
  }) => Promise<void> | void;
  submitDiscontinue: (payload: {
    certificate: Certificate;
    requestDate: string;
    auditStage: AuditStageApi;
  }) => Promise<void> | void;
};

export type AuditRequestSurveillanceDialogProps = {
  open: boolean;
  type: ActionTypeCtx;
  certificate: Certificate | null;
  onOpenChange?: (open: boolean) => void;
  onSubmitContinue?: (payload: {
    certificate: Certificate;
    requestDate: string;
    auditStage: AuditStageApi;
  }) => Promise<void> | void;
  onSubmitDiscontinue?: (payload: {
    certificate: Certificate;
    requestDate: string;
    auditStage: AuditStageApi;
  }) => Promise<void> | void;
};
