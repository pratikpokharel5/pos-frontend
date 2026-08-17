<script setup lang="ts">
import LandingPage from "~/features/landing/pages/LandingPage.vue";

definePageMeta({
  layout: "public",
});

useHead({
  title: "SalePoint",
});
</script>

<template>
  <LandingPage />
</template>
