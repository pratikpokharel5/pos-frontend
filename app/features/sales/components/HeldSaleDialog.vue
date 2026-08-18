<script setup lang="ts">
import { salesApi } from "../api/salesApi";
import type { Sale } from "../types/saleTypes";

const open = defineModel<boolean>({ required: true });

const emit = defineEmits<{
  resume: [sale: Sale];
}>();

const heldSales = ref<Sale[]>([]);
const loading = ref(false);
const resumingId = ref<number | null>(null);
const error = ref("");

watch(open, (value) => {
  if (value) {
    loadHeldSales();
  }
});

async function loadHeldSales() {
  loading.value = true;
  error.value = "";

  try {
    const response = await salesApi.list({
      status: "held",
      per_page: 100,
    });

    heldSales.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load held sales.";
  } finally {
    loading.value = false;
  }
}

async function resumeSale(sale: Sale) {
  resumingId.value = sale.id;
  error.value = "";

  try {
    const response = await salesApi.get(sale.id);
    await salesApi.unhold(sale.id);

    open.value = false;
    emit("resume", response.data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to unhold sale.";
  } finally {
    resumingId.value = null;
  }
}
</script>

<template>
  <Dialog
    title="Held Sales"
    subtitle="Choose a held sale to continue from where it was paused."
    v-model="open"
  >
    <ErrorState class="mb-3" :message="error" v-if="error" />

    <LoadingState label="Loading held sales..." v-if="loading" />

    <div class="grid gap-2.5" v-else-if="heldSales.length">
      <div
        class="rounded-app border-line bg-surface-soft flex items-center justify-between gap-3 border p-3 max-sm:grid"
        v-for="sale in heldSales"
        :key="sale.id"
      >
        <div>
          <strong class="text-text block">{{ sale.invoice_number }}</strong>
          <span class="text-muted mt-1 block text-sm">
            {{ sale.customer?.name ?? "Walk-in" }} · {{ money(sale.grand_total) }}
          </span>
          <span class="text-muted mt-1 block text-xs">{{ shortDateTime(sale.sold_at) }}</span>
        </div>

        <Button
          type="button"
          variant="primary"
          :disabled="resumingId === sale.id"
          @click="resumeSale(sale)"
        >
          {{ resumingId === sale.id ? "Loading..." : "Un Hold" }}
        </Button>
      </div>
    </div>

    <EmptyState
      title="No Held Sales"
      description="Held sales will appear here after you pause a sale."
      v-else
    />

    <template #footer>
      <Button type="button" :disabled="loading || resumingId !== null" @click="open = false">
        Close
      </Button>
    </template>
  </Dialog>
</template>
