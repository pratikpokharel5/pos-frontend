<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  eyebrow?: string;
}>();
</script>

<template>
  <header class="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div class="min-w-0">
      <p class="text-primary m-0 mb-1 text-xs font-extrabold uppercase" v-if="eyebrow">
        {{ eyebrow }}
      </p>

      <h1 class="text-text m-0 text-xl font-black sm:text-2xl">{{ title }}</h1>

      <p class="text-muted m-0 mt-1 max-w-3xl text-sm leading-relaxed" v-if="description">
        {{ description }}
      </p>
    </div>

    <div class="flex w-full flex-wrap gap-2 sm:w-auto" v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </header>
</template>
