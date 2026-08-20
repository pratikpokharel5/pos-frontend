<script setup lang="ts">
import type { BusinessSettingsForm } from "../types/settingsTypes";

const form = defineModel<BusinessSettingsForm>({ required: true });

function maxPercentValue(value: string) {
  if (value === "") {
    return "";
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return "";
  }

  if (numericValue <= 100) {
    return String(Math.max(Math.round(numericValue), 0));
  }

  return "100";
}
</script>

<template>
  <section class="grid gap-3.5 lg:grid-cols-2">
    <div class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Business Profile</h3>
          <p class="text-muted mt-1 mb-0 text-sm">Basic identity and contact details.</p>
        </div>
      </div>

      <div class="grid gap-3 p-4">
        <div class="grid gap-3 md:grid-cols-2">
          <InputField label="Business Name" v-model="form.business_name" />

          <InputField label="Phone" inputmode="tel" v-model="form.phone" />

          <InputField label="Email" type="email" inputmode="email" v-model="form.email" />

          <InputField label="Logo" v-model="form.logo" />
        </div>

        <Textarea label="Address" :rows="4" v-model="form.address" />
      </div>
    </div>

    <div class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Tax And Payments</h3>
          <p class="text-muted mt-1 mb-0 text-sm">Configure tax and payment options.</p>
        </div>
      </div>

      <div class="grid gap-3 p-4">
        <div class="grid gap-3 md:grid-cols-2">
          <SelectField label="Tax" v-model="form.tax_enabled">
            <option value="no">Disabled</option>
            <option value="yes">Enabled</option>
          </SelectField>

          <InputField
            label="Default Tax Rate"
            inputmode="decimal"
            :disabled="form.tax_enabled === 'no'"
            :model-value="form.default_tax_rate"
            @update:model-value="form.default_tax_rate = maxPercentValue($event)"
          />

          <SelectField label="Online Payment" v-model="form.online_payment_enabled">
            <option value="yes">Enabled</option>
            <option value="no">Disabled</option>
          </SelectField>
        </div>
      </div>
    </div>
  </section>
</template>
