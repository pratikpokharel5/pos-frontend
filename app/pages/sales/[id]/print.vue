<script setup lang="ts">
import PrintSalePage from "~/features/sales/pages/PrintSalePage.vue";

definePageMeta({
  layout: "print",
  middleware: "auth",
});

useHead({
  title: "SalePoint | Print Invoice",
});

const route = useRoute();
const saleId = route.params.id as string | undefined;
</script>

<template>
  <PrintSalePage :sale-id="saleId" />
</template>
