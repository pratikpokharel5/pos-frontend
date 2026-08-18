<script setup lang="ts">
import { Eye, Printer, Search, X, XCircle } from "@lucide/vue";

import { settingsApi } from "~/features/settings/api/settingsApi";
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import { salesApi } from "../api/salesApi";
import type { PaymentMethod, Sale } from "../types/saleTypes";

import SaleInvoice from "../components/SaleInvoice.vue";

type SaleStatusFilter = "" | "completed" | "held" | "voided" | "refunded";
type PaymentMethodFilter = "" | PaymentMethod;

const sales = ref<Sale[]>([]);
const selected = ref<Sale | null>(null);
const settings = ref<BusinessSettings | null>(null);
const search = ref("");
const method = ref<PaymentMethodFilter>("");
const status = ref<SaleStatusFilter>("");
const loading = ref(true);
const previewLoading = ref(false);
const error = ref("");

const auth = useAuthStore();

const tableHeaders = [
  {
    key: "invoice_number",
    label: "Invoice",
  },
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "payments",
    label: "Payment",
  },
  {
    key: "grand_total",
    label: "Total",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

async function loadSales() {
  loading.value = true;
  error.value = "";

  try {
    const response = await salesApi.list({
      search: search.value,
      payment_method: method.value,
      status: status.value,
      per_page: 100,
    });

    sales.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load sales.";
  } finally {
    loading.value = false;
  }
}

async function loadSettings() {
  try {
    const response = await settingsApi.get();
    settings.value = response.data;
  } catch {
    settings.value = null;
  }
}

async function viewSale(sale: Sale) {
  previewLoading.value = true;
  error.value = "";

  try {
    const response = await salesApi.get(sale.id);
    selected.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load invoice.";
  } finally {
    previewLoading.value = false;
  }
}

async function voidSale(sale: Sale) {
  error.value = "";

  try {
    await salesApi.void(sale.id);
    selected.value = null;
    await loadSales();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to void sale.";
  }
}

function searchSales() {
  loadSales();
}

function paymentMethodClass(method: string) {
  return cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-extrabold capitalize",
    method === "cash" && "bg-success-soft text-success",
    method === "online" && "bg-primary-soft text-primary-strong",
    method !== "cash" && method !== "online" && "bg-warning-soft text-warning",
  );
}

onMounted(() => {
  loadSettings();
  loadSales();
});
</script>

<template>
  <section>
    <PageHeader
      eyebrow="Sales"
      title="Sales History"
      description="Search invoices, review payment details, view held sales, reprint invoices, or void a sale."
    />

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Search Invoices</h3>
          <p class="text-muted mt-1 mb-0 text-sm">
            Find sales by invoice, customer, phone, product, payment, or status.
          </p>
        </div>
      </div>

      <form
        class="grid items-end justify-start gap-3 p-4 md:grid-cols-[minmax(280px,380px)_170px_170px_auto]"
        @submit.prevent="searchSales"
      >
        <InputField
          label="Search"
          placeholder="Invoice, customer, phone, product..."
          v-model="search"
        />

        <SelectField label="Payment" v-model="method">
          <option value="">All payments</option>
          <option value="cash">Cash</option>
          <option value="online">Online</option>
        </SelectField>

        <SelectField label="Status" v-model="status">
          <option value="">All statuses</option>
          <option value="completed">Completed</option>
          <option value="held">Held</option>
          <option value="voided">Voided</option>
          <option value="refunded">Refunded</option>
        </SelectField>

        <Button type="submit" :disabled="loading">
          <Search :size="17" />
          Apply
        </Button>
      </form>
    </section>

    <section class="mt-4 grid items-start gap-4">
      <div class="rounded-app border-line bg-surface shadow-app border">
        <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
          <div>
            <h3 class="m-0 text-base font-black">Invoices</h3>
            <p class="text-muted mt-1 mb-0 text-sm">Search results for recent sales.</p>
          </div>
        </div>

        <div class="p-4">
          <DataTable
            :headers="tableHeaders"
            :data="sales"
            :loading="loading"
            loading-label="Loading sales..."
            empty-title="No Sales Found"
            empty-description="Create a sale or adjust your search filters."
          >
            <template #cell-invoice_number="{ row }">
              <div>
                <strong>{{ row.invoice_number }}</strong>
                <p class="text-muted mt-1 mb-0 text-xs">{{ shortDateTime(row.sold_at) }}</p>
              </div>
            </template>

            <template #cell-customer="{ row }">
              {{ row.customer?.name ?? "Walk-in" }}
            </template>

            <template #cell-payments="{ row }">
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="payment in row.payments ?? []"
                  :key="payment.id"
                  :class="paymentMethodClass(payment.method)"
                >
                  {{ payment.method }}
                </span>
              </div>
            </template>

            <template #cell-grand_total="{ row }">
              {{ money(row.grand_total) }}
            </template>

            <template #cell-status="{ row }">
              <StatusPill :value="row.status" />
            </template>

            <template #cell-actions="{ row }">
              <div class="flex gap-2">
                <Button type="button" size="icon" title="View sale" @click="viewSale(row)">
                  <span class="sr-only">View sale</span>
                  <Eye :size="16" />
                </Button>

                <Button
                  type="button"
                  size="icon"
                  title="Void sale"
                  :disabled="row.status !== 'completed'"
                  @click="voidSale(row)"
                  v-if="auth.isAdmin"
                >
                  <span class="sr-only">Void sale</span>
                  <XCircle :size="16" />
                </Button>
              </div>
            </template>
          </DataTable>
        </div>
      </div>

      <div class="rounded-app border-line bg-surface shadow-app border">
        <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
          <div>
            <h3 class="m-0 text-base font-black">Invoice Preview</h3>
            <p class="text-muted mt-1 mb-0 text-sm">View or print the selected invoice.</p>
          </div>

          <div class="flex flex-wrap gap-2.5" v-if="selected">
            <Button type="button" @click="selected = null">
              <X :size="17" />
              Clear
            </Button>

            <Button :to="`/sales/${selected.id}/print`" v-if="selected.status === 'completed'">
              <Printer :size="17" />
              Print
            </Button>
          </div>
        </div>

        <div class="p-4">
          <LoadingState label="Loading invoice..." v-if="previewLoading" />

          <SaleInvoice :sale="selected" :settings="settings" v-else-if="selected" />

          <EmptyState
            title="No Invoice Selected"
            description="Choose an invoice from the table to preview it here."
            v-else
          />
        </div>
      </div>
    </section>
  </section>
</template>
