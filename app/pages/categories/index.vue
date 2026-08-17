<script setup lang="ts">
import CategoriesPage from "~/features/categories/pages/CategoriesPage.vue";

definePageMeta({
  middleware: "auth",
});

useHead({
  title: "SalePoint | Categories",
});
</script>

<template>
  <CategoriesPage />
</template>
