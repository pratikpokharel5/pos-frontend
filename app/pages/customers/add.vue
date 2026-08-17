<script setup lang="ts">
import AddCustomerPage from "~/features/customers/pages/AddCustomerPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Add Customer",
});
</script>

<template>
  <AddCustomerPage />
</template>
