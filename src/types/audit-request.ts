export const AUDIT_STAGE_ORDER = [
  "surveilance1",
  "surveilance2",
  "recertification",
  "surveilance3",
  "surveilance4",
  "recertification2",
  "surveilance5",
  "surveilance6",
  "recertification3",
] as const;

export const AuditStageCapitalize = [
  "Surveilance 1",
  "Surveilance 2",
  "Recertification",
  "Surveilance 3",
  "Surveilance 4",
  "Recertification 2",
  "Surveilance 5",
  "Surveilance 6",
  "Recertification 3",
] as const;

export const AUDIT_STAGE_LABELS: Record<AuditStageApi, string> = {
  surveilance1: "Surveilance 1",
  surveilance2: "Surveilance 2",
  recertification: "Recertification",
  surveilance3: "Surveilance 3",
  surveilance4: "Surveilance 4",
  recertification2: "Recertification 2",
  surveilance5: "Surveilance 5",
  surveilance6: "Surveilance 6",
  recertification3: "Recertification 3",
};

export const AUDIT_STAGE_CAPITALIZE: Record<string, AuditStageApi> = {
  "Surveillance 1": "surveilance1",
  "Surveillance 2": "surveilance2",
  Recertification: "recertification",
  "Surveillance 3": "surveilance3",
  "Surveillance 4": "surveilance4",
  "Recertification 2": "recertification2",
  "Surveillance 5": "surveilance5",
  "Surveillance 6": "surveilance6",
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

  if (s.includes("6")) return "surveilance6";
  if (s.includes("5")) return "surveilance5";
  if (s.includes("4")) return "surveilance4";
  if (s.includes("3")) return "surveilance3";
  if (s.includes("2")) return "surveilance2";
  if (s.includes("1")) return "surveilance1";

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
    case "surveilance1":
      return "Surveillance 1";
    case "surveilance2":
      return "Surveillance 2";
    case "surveilance3":
      return "Surveillance 3";
    case "surveilance4":
      return "Surveillance 4";
    case "surveilance5":
      return "Surveillance 5";
    case "surveilance6":
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
