<script setup lang="ts">
import SettingsPage from "~/features/settings/pages/SettingsPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Settings",
});
</script>

<template>
  <SettingsPage />
</template>
