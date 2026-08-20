export type PaymentMethod = "cash" | "online" | string;

export type DashboardSummary = {
  today: {
    invoice_count: number;
    subtotal: number;
    discount_total: number;
    tax_total: number;
    revenue: number;
  };
  payment_breakdown: {
    method: PaymentMethod;
    payment_count: number;
    total: number;
  }[];
  recent_sales: DashboardSale[];
};

export type DashboardSale = {
  id: number;
  invoice_number: string;
  customer: {
    id: number;
    name: string;
  } | null;
  status: string;
  grand_total: string | number;
  sold_at: string | null;
};
