<script setup lang="ts">
import AddUserPage from "~/features/users/pages/AddUserPage.vue";

definePageMeta({
  middleware: "admin",
});

useHead({
  title: "SalePoint | Add User",
});
</script>

<template>
  <AddUserPage />
</template>
