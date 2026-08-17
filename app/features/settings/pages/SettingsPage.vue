<script setup lang="ts">
import { safeParse } from "valibot";
import { RotateCcw, Save } from "@lucide/vue";

import { settingsFormSchema } from "../validations/settingsValidation";
import type { BusinessSettings } from "../types/settingsTypes";

import SettingsFormFields from "../components/SettingsFormFields.vue";

const settingsStore = useSettingsStore();

const settings = ref<BusinessSettings | null>(null);
const initialSettings = ref<BusinessSettings | null>(null);
const saving = ref(false);
const saved = ref(false);
const error = ref("");

onMounted(() => {
  loadForm();
});

async function loadForm() {
  try {
    const response = settingsStore.settings ?? (await settingsStore.fetchSettings());

    settings.value = { ...response };
    initialSettings.value = { ...response };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load settings.";
  }
}

function resetForm() {
  if (initialSettings.value) {
    settings.value = { ...initialSettings.value };
  }

  saved.value = false;
  error.value = "";
}

function maxPercentValue(value: string) {
  if (value === "") {
    return 0;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 100) {
    return Math.max(Math.round(numericValue), 0);
  }

  return 100;
}

async function submit() {
  if (!settings.value || saving.value) {
    return;
  }

  saved.value = false;
  error.value = "";

  const validation = safeParse(settingsFormSchema, settings.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    const response = await settingsStore.saveSettings(validation.output);

    settings.value = { ...response };
    initialSettings.value = { ...response };
    saved.value = true;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save settings.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <ErrorState :message="error" v-if="error && !settings" />

  <LoadingState label="Loading settings..." v-else-if="!settings" />

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="Settings"
      title="Business Settings"
      description="These details appear across invoices and sale totals."
    >
      <template #actions>
        <FormFieldset class="mb-0 flex flex-wrap items-center gap-2.5" :submitting="saving">
          <Button type="button" @click="resetForm">
            <RotateCcw :size="17" />
            Reset
          </Button>

          <Button type="submit" variant="primary">
            <Save :size="18" />
            {{ saving ? "Saving..." : "Save Settings" }}
          </Button>
        </FormFieldset>
      </template>
    </PageHeader>

    <Alert class="mb-4" variant="success" v-if="saved">Settings saved.</Alert>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <FormFieldset :submitting="saving">
      <SettingsFormFields :max-percent-value="maxPercentValue" v-model="settings" />
    </FormFieldset>
  </form>
</template>
