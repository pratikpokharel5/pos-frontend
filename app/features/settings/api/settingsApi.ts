import type { ApiResource } from "~/types";
import type { BusinessSettings, BusinessSettingsPayload } from "../types/settingsTypes";

export const settingsApi = {
  get: () =>
    apiFetch<ApiResource<BusinessSettings>>("/settings", {
      method: "GET",
    }),

  update: (payload: BusinessSettingsPayload) =>
    apiFetch<ApiResource<BusinessSettings>>("/settings", {
      method: "PUT",
      body: payload,
    }),
};
