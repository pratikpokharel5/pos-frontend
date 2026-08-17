<script setup lang="ts">
import LoginPage from "~/features/auth/pages/LoginPage.vue";

definePageMeta({
  layout: "public",
  middleware: "guest",
});

useHead({
  title: "SalePoint | Login",
});
</script>

<template>
  <LoginPage />
</template>
