<script setup lang="ts">
import AddProductPage from "~/features/products/pages/AddProductPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Add Product",
});
</script>

<template>
  <AddProductPage />
</template>
