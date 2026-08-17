import type { Category, CategoryImportResult, CategoryPayload } from "../types";
import type { ApiCollection, ApiResource, Query } from "~/types";

export const categoriesApi = {
  list: (query?: Query) =>
    apiFetch<ApiCollection<Category>>("/categories", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  get: (id: number) =>
    apiFetch<ApiResource<Category>>(`/categories/${id}`, {
      method: "GET",
    }),

  create: (payload: CategoryPayload) =>
    apiFetch<ApiResource<Category>>("/categories", {
      method: "POST",
      body: payload,
    }),

  update: (id: number, payload: CategoryPayload) =>
    apiFetch<ApiResource<Category>>(`/categories/${id}`, {
      method: "PUT",
      body: payload,
    }),

  archive: (id: number) =>
    apiFetch<void>(`/categories/${id}`, {
      method: "DELETE",
    }),

  import: (file: File) => {
    const form = new FormData();
    form.append("file", file);

    return apiFetch<ApiResource<CategoryImportResult>>("/categories/import", {
      method: "POST",
      body: form,
    });
  },
};
