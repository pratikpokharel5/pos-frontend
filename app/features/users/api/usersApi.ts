import type { ApiCollection, ApiResource, Query } from "~/types";
import type { User, UserPayload } from "../types/userTypes";

export const usersApi = {
  list: (query?: Query) =>
    apiFetch<ApiCollection<User>>("/users", {
      method: "GET",
      query: cleanQueryParams(query),
    }),

  create: (payload: UserPayload) =>
    apiFetch<ApiResource<User>>("/users", {
      method: "POST",
      body: payload,
    }),

  update: (id: number, payload: UserPayload) =>
    apiFetch<ApiResource<User>>(`/users/${id}`, {
      method: "PUT",
      body: payload,
    }),

  archive: (id: number) =>
    apiFetch<void>(`/users/${id}`, {
      method: "DELETE",
    }),
};
