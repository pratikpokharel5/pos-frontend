import { apiFetch } from "~/composables/useApi";
import type { AuthUserResponse, LoginPayload, LoginResponse, RegisterPayload } from "../types";

export const authApi = {
  login: (payload: LoginPayload) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: payload,
    }),

  register: (payload: RegisterPayload) =>
    apiFetch<LoginResponse>("/auth/register", {
      method: "POST",
      body: payload,
    }),

  me: () =>
    apiFetch<AuthUserResponse>("/auth/me", {
      method: "GET",
    }),

  logout: () =>
    apiFetch<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
};
