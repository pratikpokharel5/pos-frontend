<script setup lang="ts">
import UsersPage from "~/features/users/pages/UsersPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Users",
});
</script>

<template>
  <UsersPage />
</template>
