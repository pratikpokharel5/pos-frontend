<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  },
);

const emit = defineEmits<{
  hold: [];
  view: [];
}>();
</script>

<template>
  <div class="rounded-app border-line-strong bg-surface inline-flex overflow-hidden border">
    <button
      type="button"
      class="text-text hover:border-primary hover:bg-surface-soft focus-visible:ring-primary focus-visible:ring-offset-bg inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-extrabold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="props.disabled"
      @click="emit('hold')"
    >
      Hold Sale
    </button>

    <button
      type="button"
      class="border-line-strong text-text hover:bg-surface-soft focus-visible:ring-primary focus-visible:ring-offset-bg inline-flex items-center justify-center gap-2 border-l px-4 py-2 text-sm font-extrabold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      :disabled="props.disabled"
      @click="emit('view')"
    >
      View Hold Sale
    </button>
  </div>
</template>
