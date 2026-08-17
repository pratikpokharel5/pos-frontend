import type { Query } from "~/types";
import type { PaymentSummary, SalesSummary, TopProduct } from "../types/reportTypes";

export const reportsApi = {
  getSalesSummary: (query?: Query) =>
    apiFetch<SalesSummary>("/reports/sales-summary", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  getPaymentSummary: (query?: Query) =>
    apiFetch<PaymentSummary[]>("/reports/payment-summary", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  getTopProducts: (query?: Query) =>
    apiFetch<TopProduct[]>("/reports/top-products", {
      method: "GET",
      query: cleanQueryParams(query),
    }),
};
