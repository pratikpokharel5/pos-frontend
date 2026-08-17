<script setup lang="ts">
import NewSalePage from "~/features/sales/pages/NewSalePage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | New Sale",
});
</script>

<template>
  <NewSalePage />
</template>
