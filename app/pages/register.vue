<script setup lang="ts">
import RegisterPage from "~/features/auth/pages/RegisterPage.vue";

definePageMeta({
  layout: "public",
  middleware: "guest",
});

useHead({
  title: "SalePoint | Register",
});
</script>

<template>
  <RegisterPage />
</template>
