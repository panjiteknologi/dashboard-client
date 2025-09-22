export type TimelinePoint = {
  month: string;
  buckets: Record<string, number>;
  total: number;
};

export type TimelineProps = {
  loading: boolean;
  data: TimelinePoint[];
  monthFrom: string;
  monthTo: string;
  setMonthFrom: (v: string) => void;
  setMonthTo: (v: string) => void;
  hideZero: boolean;
  setHideZero: (v: boolean) => void;
  applyPreset: (p: "ytd" | "last30" | "last90" | "full") => void;
};
