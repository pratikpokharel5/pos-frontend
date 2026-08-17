<script setup lang="ts">
defineProps<{
  label: string;
  value: string;
  detail?: string;
}>();
</script>

<template>
  <article class="rounded-app border-line bg-surface shadow-app border p-4">
    <span class="text-muted block text-sm font-bold">{{ label }}</span>
    <strong class="my-2 block text-2xl">{{ value }}</strong>
    <small class="text-muted block text-xs" v-if="detail">{{ detail }}</small>
  </article>
</template>
