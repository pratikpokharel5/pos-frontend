import { apiFetch } from "~/composables/useApi";
import type { DashboardSummary } from "../types";

export const dashboardApi = {
  getSummary: () =>
    apiFetch<DashboardSummary>("/dashboard/summary", {
      method: "GET",
    }),
};
