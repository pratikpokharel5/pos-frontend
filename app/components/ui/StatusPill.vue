<script setup lang="ts">
const props = defineProps<{
  value: string;
}>();

const classes = computed(() =>
  cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-extrabold capitalize",
    (props.value === "active" || props.value === "completed") && "bg-success-soft text-success",
    (props.value === "inactive" || props.value === "voided" || props.value === "void") &&
      "bg-danger-soft text-danger",
    props.value === "refunded" && "bg-warning-soft text-warning",
    props.value !== "active" &&
      props.value !== "completed" &&
      props.value !== "inactive" &&
      props.value !== "voided" &&
      props.value !== "void" &&
      props.value !== "refunded" &&
      "bg-warning-soft text-warning",
  ),
);
</script>

<template>
  <span :class="classes">{{ value }}</span>
</template>
