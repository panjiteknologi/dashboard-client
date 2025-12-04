export type DataCRMType = {
  id: number;
  partner_id: number;
  partner_name: string;
  contract_number: string;
  contract_date: string | null;
  sales_person: string;
  level: string;
  tahapan_audit: string;
  iso_standards: CRMStandard[];
  nilai_kontrak: number;
  nilai_initial_audit: number;
  nilai_s1: number;
  nilai_s2: number;
  nilai_s3: number;
  nilai_s4: number;
  nilai_s5: number;
  nilai_s6: number;
  nilai_recertification: number;
  nilai_recertification2: number;
  nilai_recertification3: number;
  accreditations: string[];
};

export type CRMType = {
  data: DataCRMType[];
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

export type CRMStandard = {
  id: number;
  name: string;
};

export type StageValue = "all" | "s1" | "s2";

export type CRMContextType = {
  qInput: string;
  setQInput: (v: string) => void;
  q: string;
  stage: StageValue;
  setStageSafe: (v: StageValue) => void;
  iso: string;
  setIsoSafe: (v: string) => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  stageTmp: StageValue;
  setStageTmp: (v: StageValue) => void;
  isoTmp: string;
  setIsoTmp: (v: string) => void;
  applyDrawer: () => void;
  resetDrawer: () => void;
  hasActiveFilters: boolean;
  isoOptions: string[];
  filtered: DataCRMType[];
  clearAll: () => void;
};

export type CRMViewProps = Pick<
  CRMType,
  | "data"
  | "pagination"
  | "page"
  | "limit"
  | "onPageChange"
  | "onLimitChange"
  | "isLoading"
> & {
  refetch?: () => void;
  isFetching?: boolean;
};

export type InnerViewProps = Pick<
  CRMType,
  | "pagination"
  | "page"
  | "limit"
  | "onPageChange"
  | "onLimitChange"
  | "isLoading"
> & {
  refetch?: () => void;
  isFetching?: boolean;
};
