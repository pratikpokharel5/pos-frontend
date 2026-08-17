<script setup lang="ts">
import { Eye, EyeOff } from "@lucide/vue";

withDefaults(
  defineProps<{
    label: string;
    autocomplete?: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  {
    autocomplete: "current-password",
    placeholder: undefined,
    disabled: false,
  },
);

const visible = ref(false);

const model = defineModel<string>({ required: true });
</script>

<template>
  <label class="text-text grid gap-1.5 text-sm font-bold">
    <span>{{ label }}</span>

    <div class="relative">
      <input
        class="border-line-strong rounded-app bg-surface text-text focus:border-primary focus:ring-primary/20 min-h-10 w-full border px-2.5 py-2 pr-11 outline-none focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60"
        :type="visible ? 'text' : 'password'"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="model"
      />

      <button
        type="button"
        class="rounded-app text-muted hover:bg-surface-soft hover:text-text focus-visible:ring-primary absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center transition focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        :aria-label="visible ? 'Hide password' : 'Show password'"
        :aria-pressed="visible"
        :disabled="disabled"
        @click="visible = !visible"
      >
        <EyeOff :size="17" v-if="visible" />
        <Eye :size="17" v-else />
      </button>
    </div>
  </label>
</template>
