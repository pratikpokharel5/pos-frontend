<script setup lang="ts">
import CustomersPage from "~/features/customers/pages/CustomersPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Customers",
});
</script>

<template>
  <CustomersPage />
</template>
