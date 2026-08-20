import type { DashboardSummary } from "../types/dashboardTypes";

export const dashboardApi = {
  getSummary: () =>
    apiFetch<DashboardSummary>("/dashboard/summary", {
      method: "GET",
    }),
};
