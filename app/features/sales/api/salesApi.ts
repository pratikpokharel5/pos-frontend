import type { ApiCollection, ApiResource, Query } from "~/types";
import type { Sale, SalePayload } from "../types/saleTypes";

export const salesApi = {
  list: (query?: Query) =>
    apiFetch<ApiCollection<Sale>>("/sales", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  get: (id: number) =>
    apiFetch<ApiResource<Sale>>(`/sales/${id}`, {
      method: "GET",
    }),

  invoice: (id: number) =>
    apiFetch<ApiResource<Sale>>(`/sales/${id}/invoice`, {
      method: "GET",
    }),

  held: (query?: Query) =>
    apiFetch<ApiCollection<Sale>>("/sales/held", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  create: (payload: SalePayload) =>
    apiFetch<ApiResource<Sale>>("/sales", {
      method: "POST",
      body: payload,
    }),

  void: (id: number) =>
    apiFetch<void>(`/sales/${id}/void`, {
      method: "POST",
    }),

  unhold: (id: number) =>
    apiFetch<void>(`/sales/${id}/hold`, {
      method: "DELETE",
    }),
};
