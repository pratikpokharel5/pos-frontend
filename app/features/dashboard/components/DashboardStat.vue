<script setup lang="ts">
import type { Component } from "vue";

defineProps<{
  icon: Component;
  label: string;
  value: string;
  detail: string;
}>();
</script>

<template>
  <article
    class="rounded-app border-line bg-surface shadow-app grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 border p-4"
  >
    <div class="rounded-app bg-primary-soft text-primary-strong grid size-9 place-items-center">
      <component :is="icon" :size="18" />
    </div>
    <div>
      <span class="text-muted block text-xs font-extrabold">{{ label }}</span>
      <strong class="my-1.5 block text-[1.35rem] leading-tight">{{ value }}</strong>
      <small class="text-muted block text-xs">{{ detail }}</small>
    </div>
  </article>
</template>
