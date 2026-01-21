export const AUDIT_STAGE_ORDER = [
  "surveillance1",
  "surveillance2",
  "recertification",
  "surveillance3",
  "surveillance4",
  "recertification2",
  "surveillance5",
  "surveillance6",
  "recertification3",
] as const;

export const AuditStageCapitalize = [
  "Surveillance 1",
  "Surveillance 2",
  "Recertification",
  "Surveillance 3",
  "Surveillance 4",
  "Recertification 2",
  "Surveillance 5",
  "Surveillance 6",
  "Recertification 3",
] as const;

export const AUDIT_STAGE_LABELS: Record<AuditStageApi, string> = {
  surveillance1: "Surveillance 1",
  surveillance2: "Surveillance 2",
  recertification: "Recertification",
  surveillance3: "Surveillance 3",
  surveillance4: "Surveillance 4",
  recertification2: "Recertification 2",
  surveillance5: "Surveillance 5",
  surveillance6: "Surveillance 6",
  recertification3: "Recertification 3",
};

export const AUDIT_STAGE_CAPITALIZE: Record<string, AuditStageApi> = {
  "Surveillance 1": "surveillance1",
  "Surveillance 2": "surveillance2",
  Recertification: "recertification",
  "Surveillance 3": "surveillance3",
  "Surveillance 4": "surveillance4",
  "Recertification 2": "recertification2",
  "Surveillance 5": "surveillance5",
  "Surveillance 6": "surveillance6",
  "Recertification 3": "recertification3",
};

export const normalizeSurveillanceStage = (
  raw?: string | null
): AuditStageApi | undefined => {
  const s = (raw ?? "").toLowerCase();
  if (!s) return undefined;

  if (s.includes("recertification3")) return "recertification3";
  if (s.includes("recertification 3")) return "recertification3";
  if (s.includes("recertification2")) return "recertification2";
  if (s.includes("recertification 2")) return "recertification2";
  if (s.includes("recertification")) return "recertification";

  if (s.includes("6")) return "surveillance6";
  if (s.includes("5")) return "surveillance5";
  if (s.includes("4")) return "surveillance4";
  if (s.includes("3")) return "surveillance3";
  if (s.includes("2")) return "surveillance2";
  if (s.includes("1")) return "surveillance1";
  return undefined;
};

export type AuditStageApi = (typeof AUDIT_STAGE_ORDER)[number];

export type StageValue = "all" | "s1" | "s2";

export type DataAuditRequestType = {
  id: number;
  name: string;
  partner_name: string;
  standards: string[];
  state: string;
  cycle: string;
  audit_stage: string;
  issue_date: string;
  tgl_perkiraan_audit_selesai: string;
  note: string;
  site_address: string;
  type: string;
};

export type AuditRequestType = {
  data: DataAuditRequestType[];
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
export interface AuditRequestCtx {
  qInput: string;
  setQInput: (v: string) => void;
  q: string;
  stage: StageValue;
  setStageSafe: (v: StageValue) => void;
  iso: string;
  setIsoSafe: (v: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  isoTmp: string;
  setIsoTmp: (v: string) => void;
  applyDrawer: () => void;
  resetDrawer: () => void;
  hasActiveFilters: boolean;
  isoOptions: string[];
  filtered: DataAuditRequestType[];
  clearAll: () => void;
  selectedRequest: DataAuditRequestType | null;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  isEditOpen: boolean;
  setIsEditOpen: (open: boolean) => void;
  isDeleteOpen: boolean;
  setIsDeleteOpen: (open: boolean) => void;
  isSubmitting: boolean;
  handleOpenEdit: (req: DataAuditRequestType) => void;
  handleOpenDelete: (req: DataAuditRequestType) => void;
  handleSubmitNote: ({
    certificate,
  }: {
    certificate: DataAuditRequestType;
  }) => Promise<void> | void;
  handleConfirmDelete: ({
    certificate,
  }: {
    certificate: DataAuditRequestType;
  }) => Promise<void> | void;
}

export const getStageLabelAuditRequest = (stage: AuditStageApi) => {
  switch (stage) {
    case "surveillance1":
      return "Surlaeillance 1";
    case "surveillance2":
      return "Surlveillance 2";
    case "surveillance3":
      return "Surveillance 3";
    case "surveillance4":
      return "Surlveillance 4";
    case "surveillance5":
      return "Surveillance 5";
    case "surveillance6":
      return "Surveillance 6";
    case "recertification":
      return "Recertification 1";
    case "recertification2":
      return "Recertification 2";
    case "recertification3":
      return "Recertification 3";
    default:
      return stage;
  }
};
