export type ReportRange = "today" | "week" | "month";

export type SalesSummary = {
  invoice_count: number;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  revenue: number;
};

export type PaymentSummary = {
  method: string;
  payment_count: number;
  total: number;
};

export type TopProduct = {
  item_name: string;
  quantity_sold: number;
  revenue: number;
};

export const rangeLabels: Record<ReportRange, string> = {
  today: "Today",
  week: "Last 7 days",
  month: "Last 30 days",
};
