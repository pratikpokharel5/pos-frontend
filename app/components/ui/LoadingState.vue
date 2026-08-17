<script setup lang="ts">
import { Loader2 } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: "Loading...",
  },
);
</script>

<template>
  <div
    role="status"
    aria-busy="true"
    aria-live="polite"
    class="rounded-app border-line bg-surface/84 text-text grid place-items-center content-center justify-items-center gap-2 border p-5 text-center font-extrabold"
  >
    <span>{{ label }}</span>
    <Loader2 class="text-primary animate-spin" :size="28" />
  </div>
</template>
