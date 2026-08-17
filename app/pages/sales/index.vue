<script setup lang="ts">
import SalesPage from "~/features/sales/pages/SalesPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Sales History",
});
</script>

<template>
  <SalesPage />
</template>
