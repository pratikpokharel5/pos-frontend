<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: string;
    variant?: "info" | "success" | "error";
  }>(),
  {
    message: "",
    variant: "info",
  },
);

const classes = computed(() =>
  cn(
    "rounded-app border px-3 py-2 text-sm leading-relaxed whitespace-pre-line",
    props.variant === "info" && "border-line bg-surface-soft text-muted",
    props.variant === "success" && "border-success/20 bg-success-soft text-success",
    props.variant === "error" && "border-danger/25 bg-danger-soft text-danger",
  ),
);

const role = computed(() => (props.variant === "error" ? "alert" : "status"));
</script>

<template>
  <div :role="role" :class="classes">
    <slot>{{ message }}</slot>
  </div>
</template>
