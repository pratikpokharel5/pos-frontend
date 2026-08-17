import type { ApiCollection, ApiResource, Query } from "~/types";
import type { Product, ProductImportResult, ProductPayload } from "../types/productTypes";

export const productsApi = {
  list: (query?: Query) =>
    apiFetch<ApiCollection<Product>>("/products", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  get: (id: number) =>
    apiFetch<ApiResource<Product>>(`/products/${id}`, {
      method: "GET",
    }),

  create: (payload: ProductPayload) =>
    apiFetch<ApiResource<Product>>("/products", {
      method: "POST",
      body: payload,
    }),

  update: (id: number, payload: ProductPayload) =>
    apiFetch<ApiResource<Product>>(`/products/${id}`, {
      method: "PUT",
      body: payload,
    }),

  archive: (id: number) =>
    apiFetch<void>(`/products/${id}`, {
      method: "DELETE",
    }),

  import: (file: File) => {
    const form = new FormData();
    form.append("file", file);

    return apiFetch<ApiResource<ProductImportResult>>("/products/import", {
      method: "POST",
      body: form,
    });
  },
};
