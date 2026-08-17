<script setup lang="ts">
import { ArrowRight } from "@lucide/vue";
import type { Component } from "vue";

defineProps<{
  to: string;
  icon: Component;
  title: string;
  detail: string;
}>();
</script>

<template>
  <Button
    :to="to"
    variant="ghost"
    class="border-line bg-surface shadow-app hover:border-primary grid min-h-22 grid-cols-[auto_minmax(0,1fr)_auto] justify-stretch border p-3.5 text-left"
  >
    <span class="rounded-app bg-primary-soft text-primary-strong grid size-9 place-items-center">
      <component :is="icon" :size="19" />
    </span>
    <span>
      <strong class="mb-1 block">{{ title }}</strong>
      <small class="text-muted block text-xs font-normal">{{ detail }}</small>
    </span>
    <ArrowRight class="text-muted" :size="17" />
  </Button>
</template>
