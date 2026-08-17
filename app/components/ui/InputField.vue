<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    type?: string;
    autocomplete?: string;
    inputmode?: "none" | "text" | "decimal" | "numeric" | "tel" | "search" | "email" | "url";
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    type: "text",
    autocomplete: undefined,
    inputmode: undefined,
    placeholder: undefined,
    disabled: false,
  },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <label class="text-text grid gap-1.5 text-sm font-bold">
    <span>{{ label }}</span>
    <input
      class="border-line-strong rounded-app bg-surface text-text focus:border-primary focus:ring-primary/20 min-h-10 w-full border px-2.5 py-2 outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60"
      :type="type"
      :autocomplete="autocomplete"
      :inputmode="inputmode"
      :placeholder="placeholder"
      :disabled="disabled"
      v-model="model"
    />
  </label>
</template>
