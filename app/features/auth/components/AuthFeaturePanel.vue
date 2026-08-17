<script setup lang="ts">
import { BarChart3, CreditCard, PackageCheck, Store } from "@lucide/vue";

const counterAudiences = [
  {
    title: "Retail And Service Counters",
    description: "Sell products to customers at a counter with a simple and fast checkout flow.",
    icon: Store,
  },
  {
    title: "Catalog-Based Management",
    description: "Pick products by name, category, or SKU, then keep inactive items out of sales.",
    icon: PackageCheck,
  },
  {
    title: "Payment And Generate Invoice",
    description: "Record payment method and generate invoice in one sale flow.",
    icon: CreditCard,
  },
  {
    title: "Daily Owner Reports",
    description: "Review revenue, payments, discounts, tax, best-selling products and much more.",
    icon: BarChart3,
  },
];
</script>

<template>
  <section class="bg-primary-soft grid content-start gap-10 p-8 max-[640px]:p-5">
    <div class="grid gap-5">
      <div class="max-w-xl">
        <p class="text-primary m-0 mb-2 text-xs font-extrabold tracking-[0.12em] uppercase">
          Built for real counters
        </p>
        <h1 class="text-text m-0 text-3xl leading-tight font-black max-[640px]:text-3xl">
          Flexible enough for business owners, simple enough for cashiers.
        </h1>
      </div>
    </div>

    <div class="grid gap-3">
      <div
        v-for="{ title, description, icon: Icon } in counterAudiences"
        :key="title"
        class="rounded-app border-primary/15 bg-surface/70 grid grid-cols-[40px_1fr] items-start gap-3 border p-3"
      >
        <span class="rounded-app bg-primary-soft text-primary grid size-10 place-items-center">
          <component :is="Icon" :size="19" />
        </span>
        <span>
          <strong class="text-text block text-sm">{{ title }}</strong>
          <span class="text-muted mt-0.5 block text-sm leading-relaxed">
            {{ description }}
          </span>
        </span>
      </div>
    </div>
  </section>
</template>
