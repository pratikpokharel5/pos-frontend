<script setup lang="ts">
import EditProductPage from "~/features/products/pages/EditProductPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Edit Product",
});

const route = useRoute();
const productId = String(route.params.productId ?? "");
</script>

<template>
  <EditProductPage :product-id="productId" />
</template>
