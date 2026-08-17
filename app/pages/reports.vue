<script setup lang="ts">
import ReportsPage from "~/features/reports/pages/ReportsPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Reports",
});
</script>

<template>
  <ReportsPage />
</template>
