<script setup lang="ts">
import EditCustomerPage from "~/features/customers/pages/EditCustomerPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Edit Customer",
});

const route = useRoute();
const customerId = String(route.params.id ?? "");
</script>

<template>
  <EditCustomerPage :id="customerId" />
</template>
