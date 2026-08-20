import type { ApiCollection, ApiResource, Query } from "~/types";
import type { User, UserPayload, UserStatusPayload } from "../types/userTypes";

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

  updateStatus: (id: number, payload: UserStatusPayload) =>
    apiFetch<ApiResource<User>>(`/users/${id}/status`, {
      method: "PATCH",
      body: payload,
    }),
};
