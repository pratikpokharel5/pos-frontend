<script setup lang="ts">
import { X } from "@lucide/vue";

withDefaults(
  defineProps<{
    label: string;
    accept?: string;
    description?: string;
    disabled?: boolean;
  }>(),
  {
    accept: undefined,
    description: undefined,
    disabled: false,
  },
);

const model = defineModel<File | null>({ required: true });
const inputRef = useTemplateRef<HTMLInputElement>("inputRef");

function updateFile(event: Event) {
  const input = event.target as HTMLInputElement;

  model.value = input.files?.[0] ?? null;
}

function clearFile() {
  model.value = null;

  if (inputRef.value) {
    inputRef.value.value = "";
  }
}
</script>

<template>
  <label class="text-text grid gap-1.5 text-sm font-bold">
    <span>{{ label }}</span>

    <span class="relative">
      <input
        class="border-line-strong rounded-app bg-surface text-text file:bg-primary hover:file:bg-primary-strong focus:border-primary focus:ring-primary/20 min-h-10 w-full border py-2 pr-11 pl-2.5 outline-none file:mr-3 file:rounded-md file:border-0 file:px-3 file:py-1.5 file:text-sm file:font-extrabold file:text-white focus:ring-3 disabled:cursor-not-allowed disabled:opacity-60"
        ref="inputRef"
        type="file"
        :accept="accept"
        :disabled="disabled"
        @change="updateFile"
      />

      <button
        type="button"
        title="Clear file"
        class="text-muted hover:text-danger absolute top-1/2 right-2 grid size-7 -translate-y-1/2 place-items-center rounded-full border-0 bg-transparent outline-none disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled"
        @click="clearFile"
        v-if="model"
      >
        <span class="sr-only">Clear file</span>
        <X :size="16" />
      </button>
    </span>

    <span class="text-muted text-xs font-normal" v-if="description">{{ description }}</span>
    <span class="text-muted text-xs font-normal" v-if="model">Selected file: {{ model.name }}</span>
  </label>
</template>
