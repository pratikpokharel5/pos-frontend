export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  await auth.fetchUser();

  if (auth.isAuthenticated) {
    const redirect = Array.isArray(to.query.redirect) ? to.query.redirect[0] : to.query.redirect;
    const isAppPath =
      typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//");

    return navigateTo(isAppPath && !redirect.startsWith("/login") ? redirect : "/dashboard");
  }
});
