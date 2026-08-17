<script setup lang="ts">
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import type { Payment, Sale, SaleItem } from "../types/saleTypes";

const props = defineProps<{
  sale: Sale;
  settings?: BusinessSettings | null;
}>();

const businessDetails = computed(() =>
  [props.settings?.phone, props.settings?.email, props.settings?.address].filter(Boolean),
);

const itemHeaders = [
  {
    key: "item_name",
    label: "Item",
  },
  {
    key: "quantity",
    label: "Qty",
  },
  {
    key: "unit_price",
    label: "Price",
  },
  {
    key: "discount_amount",
    label: "Discount",
  },
  {
    key: "line_total",
    label: "Total",
  },
];

function paymentMethodClass(method: Payment["method"]) {
  return cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-extrabold capitalize",
    method === "cash" && "bg-success-soft text-success",
    method === "online" && "bg-primary-soft text-primary-strong",
  );
}
</script>

<template>
  <article class="rounded-app border-line bg-surface shadow-app border p-5">
    <div class="mt-4 flex justify-between gap-4 max-md:grid">
      <div>
        <h2 class="m-0 text-xl">{{ settings?.business_name ?? "SalePoint" }}</h2>
        <p class="text-muted mt-1 mb-0" v-for="(detail, idx) in businessDetails" :key="idx">
          {{ detail }}
        </p>
      </div>

      <div class="text-right max-md:text-left">
        <h3 class="m-0 text-base">{{ sale.invoice_number }}</h3>
        <p class="text-muted mt-1 mb-2 text-sm">{{ shortDateTime(sale.sold_at) }}</p>
        <StatusPill :value="sale.status" />
      </div>
    </div>

    <div class="mt-4">
      <strong>Customer</strong>
      <p class="text-muted mt-1 mb-0">{{ sale.customer?.name ?? "Walk-in customer" }}</p>
      <p class="text-muted mt-1 mb-0" v-if="sale.customer?.phone">{{ sale.customer.phone }}</p>
    </div>

    <div class="mt-4">
      <DataTable
        :headers="itemHeaders"
        :data="(sale.items ?? []) as SaleItem[]"
        empty-title="No Invoice Items"
        empty-description="This invoice does not include item details."
      >
        <template #cell-unit_price="{ row }">
          {{ money(row.unit_price) }}
        </template>

        <template #cell-discount_amount="{ row }">
          {{ money(row.discount_amount) }}
        </template>

        <template #cell-line_total="{ row }">
          {{ money(row.line_total) }}
        </template>
      </DataTable>
    </div>

    <div class="mt-4 ml-auto grid max-w-80 gap-2.5">
      <div class="flex justify-between gap-3">
        <span class="text-muted">Subtotal</span>
        <b>{{ money(sale.subtotal) }}</b>
      </div>

      <div class="flex justify-between gap-3">
        <span class="text-muted">Discount</span>
        <b>{{ money(sale.discount_amount) }}</b>
      </div>

      <div class="flex justify-between gap-3">
        <span class="text-muted">Tax</span>
        <b>{{ money(sale.tax_amount) }}</b>
      </div>

      <div class="border-line flex justify-between gap-3 border-t pt-2 text-lg">
        <span>Grand total</span>
        <strong>{{ money(sale.grand_total) }}</strong>
      </div>
    </div>

    <div class="mt-4">
      <strong>Payment</strong>
      <div class="mt-2 grid gap-2">
        <p
          class="m-0 flex items-center gap-2"
          v-for="payment in sale.payments ?? []"
          :key="payment.id"
        >
          <span :class="paymentMethodClass(payment.method)">{{ payment.method }}</span>
          <span>{{ money(payment.amount) }}</span>
        </p>
      </div>
    </div>
  </article>
</template>
