<script setup lang="ts">
import {
  Users,
  Boxes,
  Percent,
  Banknote,
  RefreshCcw,
  ReceiptText,
  ShoppingCart,
} from "@lucide/vue";

import { dashboardApi } from "../api/dashboardApi";
import type { DashboardSummary } from "../types/dashboardTypes";

import DashboardStat from "../components/DashboardStat.vue";
import PaymentMethodPill from "../components/PaymentMethodPill.vue";
import QuickLink from "../components/QuickLink.vue";

const summary = ref<DashboardSummary | null>(null);
const loading = ref(true);
const error = ref("");

const recentSaleTableHeaders = [
  {
    key: "invoice_number",
    label: "Invoice",
  },
  {
    key: "customer",
    label: "Customer",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "grand_total",
    label: "Total",
  },
  {
    key: "sold_at",
    label: "Date",
  },
];

onMounted(() => {
  loadDashboard();
});

const averageSale = computed(() => {
  if (!summary.value?.today.invoice_count) {
    return 0;
  }

  return summary.value.today.revenue / summary.value.today.invoice_count;
});

async function loadDashboard() {
  loading.value = true;
  error.value = "";

  try {
    summary.value = await dashboardApi.getSummary();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load dashboard.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <section>
    <PageHeader
      eyebrow="Dashboard"
      title="Today At A Glance"
      description="Track current sales activity and jump into the workflows used most at the counter."
    >
      <template #actions>
        <Button type="button" :disabled="loading" @click="loadDashboard">
          <RefreshCcw :size="17" />
          Refresh
        </Button>

        <Button to="/sales/new" variant="primary">
          <ShoppingCart :size="18" />
          Start Sale
        </Button>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <LoadingState label="Loading dashboard..." v-if="loading" />

    <template v-else-if="summary">
      <section class="mt-4 grid gap-3.5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          label="Revenue Today"
          :icon="Banknote"
          :value="money(summary.today.revenue)"
          :detail="`${summary.today.invoice_count} invoices`"
        />

        <DashboardStat
          label="Average Sale"
          :icon="ReceiptText"
          :value="money(averageSale)"
          detail="Revenue divided by invoices"
        />

        <DashboardStat
          label="Discounts"
          :icon="Percent"
          :value="money(summary.today.discount_total)"
          detail="Total discounts applied"
        />

        <DashboardStat
          label="Tax"
          detail="Collected today"
          :icon="ReceiptText"
          :value="money(summary.today.tax_total)"
        />
      </section>

      <section
        class="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.35fr)]"
      >
        <div class="rounded-app border-line bg-surface shadow-app border">
          <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
            <div>
              <h3 class="m-0 text-base font-black">Payments</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Today's totals grouped by payment method.</p>
            </div>
          </div>

          <div class="p-4">
            <div class="grid gap-2.5" v-if="summary.payment_breakdown.length">
              <div
                class="border-line bg-surface-soft rounded-app flex items-center justify-between gap-3 border p-3"
                :key="payment.method"
                v-for="payment in summary.payment_breakdown"
              >
                <div>
                  <PaymentMethodPill :method="payment.method" />
                  <small class="text-muted mt-1.5 block text-xs">
                    {{ payment.payment_count }} payments
                  </small>
                </div>

                <strong class="text-base">{{ money(payment.total) }}</strong>
              </div>
            </div>

            <EmptyState
              title="No Payments Yet"
              description="Payment totals will appear after the first sale today."
              v-else
            />
          </div>
        </div>

        <div class="rounded-app border-line bg-surface shadow-app border">
          <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
            <div>
              <h3 class="m-0 text-base font-black">Recent Sales</h3>
              <p class="text-muted mt-1 mb-0 text-sm">Latest invoices from the counter.</p>
            </div>

            <Button to="/sales" variant="ghost">View All</Button>
          </div>

          <div class="p-4">
            <DataTable
              :data="summary.recent_sales"
              :headers="recentSaleTableHeaders"
              v-if="summary.recent_sales.length"
            >
              <template #cell-invoice_number="{ row }">
                <strong>{{ row.invoice_number }}</strong>
              </template>

              <template #cell-customer="{ row }">
                {{ row.customer?.name ?? "Walk-in" }}
              </template>

              <template #cell-status="{ row }">
                <StatusPill :value="row.status" />
              </template>

              <template #cell-grand_total="{ row }">
                {{ money(row.grand_total) }}
              </template>

              <template #cell-sold_at="{ row }">
                {{ shortDateTime(row.sold_at) }}
              </template>
            </DataTable>

            <EmptyState
              title="No Recent Sales"
              description="Saved invoices will appear here."
              v-else
            />
          </div>
        </div>
      </section>

      <section class="mt-4 grid gap-3.5 md:grid-cols-3">
        <QuickLink
          to="/products"
          title="Products"
          :icon="Boxes"
          detail="View items available for sale."
        />

        <QuickLink
          to="/customers"
          title="Customers"
          :icon="Users"
          detail="Keep names and phone numbers ready."
        />

        <QuickLink
          to="/sales"
          title="Sales History"
          :icon="ReceiptText"
          detail="Search invoices and review sale details."
        />
      </section>
    </template>
  </section>
</template>
