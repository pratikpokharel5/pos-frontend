import { AUTH_TOKEN_KEY } from "~/types";

type FetchOptions = Parameters<typeof $fetch>[1];

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly details?: unknown,
  ) {
    super(message);
  }
}

function getErrorMessage(body: unknown) {
  if (body && typeof body === "object" && "message" in body) {
    return String(body.message);
  }

  return "Something went wrong while talking to the backend.";
}

export async function apiFetch<T>(url: string, options: FetchOptions = {}) {
  const config = useRuntimeConfig();
  const auth = useAuthStore();

  const token = auth.token ?? useCookie<string | null>(AUTH_TOKEN_KEY).value;

  try {
    return await $fetch<T>(url, {
      ...options,
      baseURL: config.public.apiBase,
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch (error: unknown) {
    const fetchError = error as {
      status?: number;
      statusCode?: number;
      data?: unknown;
    };

    const status = fetchError.statusCode ?? fetchError.status ?? 0;

    if (status === 401 && import.meta.client) {
      auth.clearSession();
      await navigateTo("/login");
    }

    const err = getErrorMessage(fetchError.data);

    throw new ApiError(err, status, fetchError.data);
  }
}
