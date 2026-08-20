<script setup lang="ts">
import { ArrowLeft, Printer } from "@lucide/vue";

import { settingsApi } from "~/features/settings/api/settingsApi";
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import { salesApi } from "../api/salesApi";
import type { Sale } from "../types/saleTypes";

import PrintInvoice from "../components/PrintInvoice.vue";

const props = defineProps<{
  saleId: string | undefined;
}>();

const sale = ref<Sale | null>(null);
const settings = ref<BusinessSettings | null>(null);
const loading = ref(true);
const error = ref("");

onMounted(() => {
  loadInvoice();
});

function openPrintWindow() {
  window.print();
}

async function loadInvoice() {
  const id = Number(props.saleId);

  if (!Number.isInteger(id) || id <= 0) {
    error.value = "Invalid invoice selected.";
    loading.value = false;
    return;
  }

  try {
    const [saleResponse, settingsResponse] = await Promise.all([
      salesApi.invoice(id),
      settingsApi.get(),
    ]);

    sale.value = saleResponse.data;
    settings.value = settingsResponse.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load invoice.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading invoice..." full-height v-if="loading" />

  <section class="mx-auto grid max-w-4xl gap-4" v-else-if="sale">
    <div class="no-print flex flex-wrap justify-center gap-2">
      <Button to="/sales">
        <ArrowLeft :size="17" />
        Back
      </Button>

      <Button type="button" variant="primary" @click="openPrintWindow()">
        <Printer :size="17" />
        Print
      </Button>
    </div>

    <PrintInvoice :sale="sale" :settings="settings" />
  </section>

  <section class="mx-auto max-w-md" v-else>
    <ErrorState :message="error || 'Unable to load invoice.'" />
  </section>
</template>
