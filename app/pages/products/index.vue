<script setup lang="ts">
import ProductsPage from "~/features/products/pages/ProductsPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Products",
});
</script>

<template>
  <ProductsPage />
</template>
