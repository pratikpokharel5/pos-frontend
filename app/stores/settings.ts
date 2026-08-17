import { defineStore } from "pinia";

import { settingsApi } from "~/features/settings/api/settingsApi";
import type {
  BusinessSettings,
  BusinessSettingsPayload,
} from "~/features/settings/types/settingsTypes";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    settings: null as BusinessSettings | null,
    loading: false,
  }),

  getters: {
    taxEnabled: (state) => Boolean(state.settings?.tax_enabled),
    defaultTaxRate: (state) => Number(state.settings?.default_tax_rate ?? 0),
  },

  actions: {
    async fetchSettings() {
      this.loading = true;

      try {
        const response = await settingsApi.get();

        this.settings = response.data;
        return response.data;
      } finally {
        this.loading = false;
      }
    },

    async saveSettings(payload: BusinessSettingsPayload) {
      const response = await settingsApi.update(payload);

      this.settings = response.data;
      return response.data;
    },
  },
});
