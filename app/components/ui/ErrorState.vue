<script setup lang="ts">
defineProps<{
  message: string;
}>();
</script>

<template>
  <Alert variant="error" :message="message" />
</template>
