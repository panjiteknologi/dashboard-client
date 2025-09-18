export type HistoryChange = {
  label: string;
  old: string | boolean;
  new: string | boolean;
};

export type HistoryTypes = {
  document_no: string;
  customer: string;
  standards: string[];
  id: number;
  model: string;
  record_id: number;
  record_name: string;
  date: string;
  author: string;
  changes: HistoryChange[];
};
