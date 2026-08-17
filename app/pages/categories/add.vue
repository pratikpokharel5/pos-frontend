<script setup lang="ts">
import AddCategoryPage from "~/features/categories/pages/AddCategoryPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Add Category",
});
</script>

<template>
  <AddCategoryPage />
</template>
