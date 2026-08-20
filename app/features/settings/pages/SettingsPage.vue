<script setup lang="ts">
import { safeParse } from "valibot";
import { RotateCcw, Save } from "@lucide/vue";

import { settingsFormSchema } from "../validations/settingsValidation";
import type { BusinessSettings, BusinessSettingsForm } from "../types/settingsTypes";

import SettingsFormFields from "../components/SettingsFormFields.vue";

const settingsStore = useSettingsStore();

const form = ref<BusinessSettingsForm | null>(null);
const initialForm = ref<BusinessSettingsForm | null>(null);
const saving = ref(false);
const saved = ref(false);
const error = ref("");

onMounted(() => {
  loadForm();
});

function settingsToForm(settings: BusinessSettings): BusinessSettingsForm {
  return {
    business_name: settings.business_name,
    logo: settings.logo ?? "",
    address: settings.address ?? "",
    phone: settings.phone,
    email: settings.email ?? "",
    tax_enabled: settings.tax_enabled ? "yes" : "no",
    default_tax_rate: String(settings.default_tax_rate),
    online_payment_enabled: settings.online_payment_enabled ? "yes" : "no",
  };
}

async function loadForm() {
  try {
    const response = settingsStore.settings ?? (await settingsStore.fetchSettings());
    const settingsForm = settingsToForm(response);

    form.value = { ...settingsForm };
    initialForm.value = { ...settingsForm };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load settings.";
  }
}

function resetForm() {
  if (initialForm.value) {
    form.value = { ...initialForm.value };
  }

  saved.value = false;
  error.value = "";
}

async function submit() {
  if (!form.value || saving.value) {
    return;
  }

  saved.value = false;
  error.value = "";

  const validation = safeParse(settingsFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    const response = await settingsStore.saveSettings(validation.output);
    const settingsForm = settingsToForm(response);

    form.value = { ...settingsForm };
    initialForm.value = { ...settingsForm };
    saved.value = true;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save settings.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <ErrorState :message="error" v-if="error && !form" />

  <LoadingState label="Loading settings..." v-else-if="!form" />

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

    <Alert class="mb-4" variant="success" auto-dismiss v-if="saved">
      Business settings saved successfully.
    </Alert>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <FormFieldset :submitting="saving">
      <SettingsFormFields v-model="form" />
    </FormFieldset>
  </form>
</template>
