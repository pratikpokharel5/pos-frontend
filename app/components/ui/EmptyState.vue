<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
}>();
</script>

<template>
  <div class="rounded-app border-line border border-dashed p-8 text-center">
    <h3 class="text-text m-0 text-base font-black">{{ title }}</h3>

    <p class="text-muted m-0 mt-2 text-sm" v-if="description">{{ description }}</p>

    <div class="mt-4 flex justify-center gap-2" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
