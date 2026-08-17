import type { AuthUser } from "@/features/auth/types/authTypes";

export const AUTH_TOKEN_KEY = "pos_auth_token";
export const AUTH_USER_KEY = "pos_auth_user";

export type Query = Record<string, string | number | boolean | null | undefined>;
export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ApiRequestOptions = {
  method?: ApiMethod;
  body?: unknown;
  query?: Query;
};

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

export function getAuthToken() {
  if (import.meta.server) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string) {
  if (import.meta.server) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthUser() {
  if (import.meta.server) {
    return null;
  }

  const value = window.localStorage.getItem(AUTH_USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    window.localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
}

export function setAuthUser(user: AuthUser) {
  if (import.meta.server) {
    return;
  }

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  if (import.meta.client) {
    window.localStorage.removeItem(AUTH_TOKEN_KEY);
    window.localStorage.removeItem(AUTH_USER_KEY);
  }
}

export function cleanQueryParams(query?: Query) {
  return Object.fromEntries(
    Object.entries(query ?? {}).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  );
}
