<script setup lang="ts">
import DashboardPage from "~/features/dashboard/pages/DashboardPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Dashboard",
});
</script>

<template>
  <DashboardPage />
</template>
