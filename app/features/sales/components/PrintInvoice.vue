<script setup lang="ts">
import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import type { Payment, Sale } from "../types/saleTypes";

const props = defineProps<{
  sale: Sale;
  settings?: BusinessSettings | null;
}>();

const primaryPayment = computed<Payment | null>(() => props.sale.payments?.[0] ?? null);

const taxableAmount = computed(() => {
  const subtotal = numberValue(props.sale.subtotal);
  const discount = numberValue(props.sale.discount_amount);

  return Math.max(subtotal - discount, 0);
});

function invoiceAmount(value: string | number | null | undefined) {
  return Number(value ?? 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function paidAmount(value: string | number | null | undefined) {
  return Math.round(Number(value ?? 0)).toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}
</script>

<template>
  <div class="flex justify-center bg-gray-100 p-5">
    <div class="w-72 rounded border border-gray-200 bg-white p-4 text-xs leading-tight text-black">
      <div class="mb-3 text-center">
        <h1 class="text-base font-bold tracking-wider text-black uppercase">
          {{ settings?.business_name ?? "SalePoint" }}
        </h1>
        <p class="text-gray-600" v-if="settings?.address">{{ settings.address }}</p>
        <p class="text-gray-600" v-if="settings?.phone">Tel: {{ settings.phone }}</p>
      </div>

      <div class="my-2 space-y-1 border-y border-dashed border-gray-400 py-2">
        <div>
          Invoice No:
          <strong>{{ sale.invoice_number }}</strong>
        </div>
        <div>
          Date:
          <strong>{{ shortDateTime(sale.sold_at) }}</strong>
        </div>
        <div>
          Customer:
          <strong>{{ sale.customer?.name ?? "Walk-In" }}</strong>
        </div>
      </div>

      <table class="my-3 w-full text-left">
        <thead>
          <tr class="border-b border-black text-black">
            <th class="w-8 py-1">QTY</th>
            <th class="py-1">DESCRIPTION</th>
            <th class="py-1 text-right">RATE</th>
            <th class="py-1 text-right">AMT</th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-200">
          <tr v-for="item in sale.items ?? []" :key="item.id">
            <td class="py-1.5 align-top">{{ item.quantity }}</td>
            <td class="py-1.5 align-top">{{ item.item_name }}</td>
            <td class="py-1.5 text-right align-top">{{ invoiceAmount(item.unit_price) }}</td>
            <td class="py-1.5 text-right align-top">{{ invoiceAmount(item.line_total) }}</td>
          </tr>
        </tbody>
      </table>

      <div class="space-y-1 border-t border-dashed border-gray-400 pt-2">
        <div class="flex justify-between">
          <span>Subtotal</span>
          <span>{{ invoiceAmount(sale.subtotal) }}</span>
        </div>
        <div class="flex justify-between" v-if="numberValue(sale.discount_amount) > 0">
          <span>Discount</span>
          <span>{{ invoiceAmount(sale.discount_amount) }}</span>
        </div>
        <div class="flex justify-between font-medium">
          <span>Taxable Amount</span>
          <span>{{ invoiceAmount(taxableAmount) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>VAT ({{ invoiceAmount(sale.tax_rate) }}%)</span>
          <span>{{ invoiceAmount(sale.tax_amount) }}</span>
        </div>
      </div>

      <div
        class="my-2 flex justify-between border-y-2 border-black py-1.5 text-sm font-bold text-black"
      >
        <span>GRAND TOTAL</span>
        <span>NPR {{ invoiceAmount(sale.grand_total) }}</span>
      </div>

      <div class="my-2 space-y-1" v-if="primaryPayment">
        <div class="flex justify-between">
          <span>Payment Method</span>
          <span class="font-medium capitalize">{{ primaryPayment.method }}</span>
        </div>
        <div class="flex justify-between" v-if="primaryPayment.provider">
          <span>Payment Provider</span>
          <span class="font-medium">{{ primaryPayment.provider }}</span>
        </div>
        <div class="flex justify-between">
          <span>Amount Paid</span>
          <span>NPR {{ paidAmount(primaryPayment.amount) }}</span>
        </div>
      </div>

      <div class="mt-3 space-y-1 border-t border-dashed border-gray-400 pt-3 text-center">
        <p class="font-bold text-black">THANK YOU! VISIT AGAIN</p>
        <p class="text-[10px] text-gray-500 uppercase">Computer Generated Tax Invoice</p>
      </div>
    </div>
  </div>
</template>
