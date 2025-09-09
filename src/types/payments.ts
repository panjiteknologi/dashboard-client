export interface InvoiceTypes {
  invoice_id: number;
  invoice_name: string;
  invoice_date: string;
  amount_total: number;
  payment_state: string;
  state: string;
}

export interface OrderTypes {
  order_id: number;
  order_name: string;
  order_date: string;
  salesperson: string;
  total_amount: number;
  amount_remaining: number;
  amount_paid: number;
  invoice_status: string;
  payment_state: string;
  currency: string;
  customer_reference: string;
  invoices: InvoiceTypes[];
}

export interface ApiResponseTypes {
  status: "success" | "error";
  data: OrderTypes[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}
