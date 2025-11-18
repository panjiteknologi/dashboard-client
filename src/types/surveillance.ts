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
  urgency_level?: 'low' | 'medium' | 'high' | 'critical' | string | null;
  surveillance_stage?: 'Surveillance 1' | 'Surveillance 2' | string | null;
  status_expiry: {
    label: string;
    status: 'expired' | 'expiring_soon' | 'still_valid';
  };

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
