<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    to?: string;
    type?: "button" | "submit";
    variant?: "primary" | "secondary" | "ghost" | "danger";
    size?: "default" | "icon";
    disabled?: boolean;
  }>(),
  {
    type: "button",
    variant: "secondary",
    size: "default",
    disabled: false,
  },
);

const classes = computed(() =>
  cn(
    "rounded-app focus-visible:ring-primary focus-visible:ring-offset-bg inline-flex items-center justify-center gap-2 text-sm font-extrabold text-white no-underline transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
    props.size === "default" && "min-h-10 px-4 py-2",
    props.size === "icon" && "size-10 p-0",
    props.variant === "primary" && "bg-primary hover:bg-primary-strong",
    props.variant === "secondary" &&
      "border-line-strong bg-surface text-text hover:border-primary border",
    props.variant === "ghost" && "text-muted hover:bg-surface hover:text-text",
    props.variant === "danger" &&
      "bg-danger-soft text-danger hover:border-danger border-danger/20 border",
    props.disabled && "pointer-events-none opacity-60",
  ),
);
</script>

<template>
  <NuxtLink :to="to" :class="classes" v-if="to">
    <slot />
  </NuxtLink>
  <button :type="type" :disabled="disabled" :class="classes" v-else>
    <slot />
  </button>
</template>
