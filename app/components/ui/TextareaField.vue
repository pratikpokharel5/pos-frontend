<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    rows?: number;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    rows: 4,
    placeholder: undefined,
    disabled: false,
  },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <label class="text-text grid gap-1.5 text-sm font-bold">
    <span>{{ label }}</span>
    <textarea
      class="border-line-strong rounded-app bg-surface text-text focus:border-primary focus:ring-primary/20 min-h-22 w-full resize-none border px-2.5 py-2.5 outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="model"
    />
  </label>
</template>
