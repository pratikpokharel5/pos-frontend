<script setup lang="ts">
import type { BusinessSettings } from "../types/settingsTypes";

const props = defineProps<{
  maxPercentValue: (value: string) => number;
}>();

const settings = defineModel<BusinessSettings>({ required: true });

const defaultTaxRate = computed({
  get: () => String(settings.value.default_tax_rate ?? ""),
  set: (value) => {
    settings.value.default_tax_rate = props.maxPercentValue(value);
  },
});

const email = computed({
  get: () => settings.value.email ?? "",
  set: (value) => {
    settings.value.email = value;
  },
});

const logo = computed({
  get: () => settings.value.logo ?? "",
  set: (value) => {
    settings.value.logo = value;
  },
});

const address = computed({
  get: () => settings.value.address ?? "",
  set: (value) => {
    settings.value.address = value;
  },
});

const taxEnabled = computed({
  get: () => (settings.value.tax_enabled ? "yes" : "no"),
  set: (value) => {
    settings.value.tax_enabled = value === "yes";
  },
});

const onlinePaymentEnabled = computed({
  get: () => (settings.value.online_payment_enabled ? "yes" : "no"),
  set: (value) => {
    settings.value.online_payment_enabled = value === "yes";
  },
});
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
          <InputField label="Business Name" v-model="settings.business_name" />

          <InputField label="Phone" inputmode="tel" v-model="settings.phone" />

          <InputField label="Email" type="email" inputmode="email" v-model="email" />

          <InputField label="Logo" v-model="logo" />
        </div>

        <TextareaField label="Address" :rows="4" v-model="address" />
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
          <SelectField label="Tax" v-model="taxEnabled">
            <option value="no">Disabled</option>
            <option value="yes">Enabled</option>
          </SelectField>

          <InputField
            label="Default Tax Rate"
            type="number"
            inputmode="decimal"
            :disabled="!settings.tax_enabled"
            v-model="defaultTaxRate"
          />

          <SelectField label="Online Payment" v-model="onlinePaymentEnabled">
            <option value="yes">Enabled</option>
            <option value="no">Disabled</option>
          </SelectField>
        </div>
      </div>
    </div>
  </section>
</template>
