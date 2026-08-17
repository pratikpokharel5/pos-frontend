import { authApi } from "~/features/auth/api/authApi";
import type { AuthUser, LoginPayload, RegisterPayload } from "~/features/auth/types";
import { AUTH_TOKEN_KEY } from "~/types";

function authTokenCookie() {
  return useCookie<string | null>(AUTH_TOKEN_KEY, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
    sameSite: "lax",
  });
}

export const useAuthStore = defineStore("auth", () => {
  const user = ref<AuthUser | null>(null);

  const token = authTokenCookie();

  const isAuthenticated = computed(() => Boolean(token.value && user.value));
  const isAdmin = computed(() => user.value?.role === "admin");
  const businessName = computed(() => user.value?.business?.name ?? "SalePoint");

  function setSession(nextToken: string, nextUser: AuthUser) {
    token.value = nextToken;
    user.value = nextUser;
  }

  function clearSession() {
    token.value = null;
    user.value = null;
  }

  async function fetchUser() {
    if (!token.value) {
      clearSession();
      return;
    }

    try {
      const response = await authApi.me();
      user.value = response.user;
    } catch {
      clearSession();
    }
  }

  async function login(payload: LoginPayload) {
    const response = await authApi.login(payload);
    setSession(response.token, response.user);
  }

  async function register(payload: RegisterPayload) {
    const response = await authApi.register(payload);
    setSession(response.token, response.user);
  }

  async function logout() {
    const hadToken = Boolean(token.value);
    user.value = null;

    if (hadToken) {
      try {
        await authApi.logout();
      } catch {
        // Local logout should still win if the token is already invalid.
      }
    }

    clearSession();
    await navigateTo("/login");
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    businessName,
    setSession,
    clearSession,
    fetchUser,
    login,
    register,
    logout,
  };
});
