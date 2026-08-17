<script setup lang="ts">
import { RefreshCw } from "@lucide/vue";

import { reportsApi } from "../api/reportsApi";
import { rangeLabels } from "../types/reportTypes";
import type { PaymentSummary, ReportRange, SalesSummary, TopProduct } from "../types/reportTypes";

function dateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function queryForRange(range: ReportRange) {
  const now = new Date();
  const from = new Date(now);

  if (range === "week") {
    from.setDate(now.getDate() - 6);
  }

  if (range === "month") {
    from.setDate(now.getDate() - 29);
  }

  return {
    from: dateValue(range === "today" ? now : from),
    to: dateValue(now),
  };
}

const range = ref<ReportRange>("today");
const summary = ref<SalesSummary | null>(null);
const payments = ref<PaymentSummary[]>([]);
const topProducts = ref<TopProduct[]>([]);
const loading = ref(true);
const error = ref("");

const topProductHeaders = [
  {
    key: "item_name",
    label: "Item",
  },
  {
    key: "quantity_sold",
    label: "Qty",
  },
  {
    key: "revenue",
    label: "Revenue",
  },
];

async function loadReports() {
  loading.value = true;
  error.value = "";

  try {
    const query = queryForRange(range.value);
    const [salesSummary, paymentSummary, productSummary] = await Promise.all([
      reportsApi.getSalesSummary(query),
      reportsApi.getPaymentSummary(query),
      reportsApi.getTopProducts({ ...query, limit: 10 }),
    ]);

    summary.value = salesSummary;
    payments.value = paymentSummary;
    topProducts.value = productSummary;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load reports.";
  } finally {
    loading.value = false;
  }
}

function paymentMethodClass(method: string) {
  return cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-extrabold capitalize",
    method === "cash" && "bg-success-soft text-success",
    method === "online" && "bg-primary-soft text-primary-strong",
    method !== "cash" && method !== "online" && "bg-warning-soft text-warning",
  );
}

watch(
  range,
  () => {
    loadReports();
  },
  {
    immediate: true,
  },
);
</script>

<template>
  <section>
    <PageHeader
      eyebrow="Reports"
      title="Sales Reports"
      :description="`Simple sales and payment summaries for ${rangeLabels[range].toLowerCase()}.`"
    >
      <template #actions>
        <div class="mb-0 flex flex-wrap items-end gap-2.5">
          <SelectField label="Range" v-model="range">
            <option value="today">Today</option>
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
          </SelectField>

          <Button type="button" :disabled="loading" @click="loadReports">
            <RefreshCw :size="17" />
            Refresh
          </Button>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <LoadingState label="Loading reports..." v-if="loading || !summary" />

    <template v-else>
      <section class="mt-4 grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Revenue"
          :value="money(summary.revenue)"
          :detail="`${summary.invoice_count} invoices`"
        />
        <StatCard label="Subtotal" :value="money(summary.subtotal)" />
        <StatCard label="Discounts" :value="money(summary.discount_total)" />
        <StatCard label="Tax" :value="money(summary.tax_total)" />
      </section>

      <section class="mt-4 grid gap-3.5 lg:grid-cols-2">
        <div class="rounded-app border-line bg-surface shadow-app border">
          <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
            <div>
              <h3 class="m-0 text-base font-black">Payment Breakdown</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Totals grouped by payment method.</p>
            </div>
          </div>

          <div class="p-4">
            <div class="grid gap-2.5" v-if="payments.length">
              <div
                class="flex justify-between gap-3"
                v-for="payment in payments"
                :key="payment.method"
              >
                <span :class="paymentMethodClass(payment.method)">
                  {{ payment.method }}
                </span>
                <strong class="text-xl">{{ money(payment.total) }}</strong>
              </div>
            </div>

            <EmptyState
              title="No Payments"
              description="Payments will appear here after sales are recorded."
              v-else
            />
          </div>
        </div>

        <div class="rounded-app border-line bg-surface shadow-app border">
          <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
            <div>
              <h3 class="m-0 text-base font-black">Top Products</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Best sellers by quantity.</p>
            </div>
          </div>

          <div class="p-4">
            <DataTable
              :headers="topProductHeaders"
              :data="topProducts"
              empty-title="No product sales"
              empty-description="Top products will appear after item sales exist in this range."
            >
              <template #cell-revenue="{ row }">
                {{ money(row.revenue) }}
              </template>
            </DataTable>
          </div>
        </div>
      </section>
    </template>
  </section>
</template>
