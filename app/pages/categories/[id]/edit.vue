<script setup lang="ts">
import EditCategoryPage from "~/features/categories/pages/EditCategoryPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Edit Category",
});

const route = useRoute();

const categoryId = route.params.id as string | undefined;
</script>

<template>
  <EditCategoryPage :id="categoryId" />
</template>
