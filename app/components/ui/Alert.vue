<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    message?: string;
    variant?: "info" | "success" | "error";
    autoDismiss?: boolean;
  }>(),
  {
    message: "",
    variant: "info",
    autoDismiss: false,
  },
);

let dismissTimer: ReturnType<typeof setTimeout> | null = null;

const visible = ref(true);

const classes = computed(() =>
  cn(
    "rounded-app border px-3 py-2 text-sm leading-relaxed whitespace-pre-line",
    props.variant === "info" && "border-line bg-surface-soft text-muted",
    props.variant === "success" && "border-success/20 bg-success-soft text-success",
    props.variant === "error" && "border-danger/25 bg-danger-soft text-danger",
  ),
);

const role = computed(() => (props.variant === "error" ? "alert" : "status"));

function startDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }

  visible.value = true;

  if (!props.autoDismiss) {
    return;
  }

  dismissTimer = setTimeout(() => {
    visible.value = false;
  }, 3000);
}

watch(() => [props.message, props.autoDismiss], startDismissTimer, { immediate: true });

onBeforeUnmount(() => {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
});
</script>

<template>
  <div :role="role" :class="classes" v-if="visible">
    <slot>{{ message }}</slot>
  </div>
</template>
