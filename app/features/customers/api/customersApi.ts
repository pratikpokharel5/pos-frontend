import type { ApiCollection, ApiResource, Query } from "~/types";
import type { Customer, CustomerPayload } from "../types/customerTypes";

export const customersApi = {
  list: (query?: Query) =>
    apiFetch<ApiCollection<Customer>>("/customers", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  get: (id: number) =>
    apiFetch<ApiResource<Customer>>(`/customers/${id}`, {
      method: "GET",
    }),

  create: (payload: CustomerPayload) =>
    apiFetch<ApiResource<Customer>>("/customers", {
      method: "POST",
      body: payload,
    }),

  update: (id: number, payload: CustomerPayload) =>
    apiFetch<ApiResource<Customer>>(`/customers/${id}`, {
      method: "PUT",
      body: payload,
    }),

  archive: (id: number) =>
    apiFetch<void>(`/customers/${id}`, {
      method: "DELETE",
    }),
};
