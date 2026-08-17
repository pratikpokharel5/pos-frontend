<script setup lang="ts">
const props = defineProps<{
  method: string;
}>();

const classes = computed(() =>
  cn(
    "inline-flex items-center rounded-full px-2 py-1 text-xs font-extrabold capitalize",
    props.method === "cash" && "bg-success-soft text-success",
    props.method === "online" && "bg-primary-soft text-primary-strong",
    props.method !== "cash" && props.method !== "online" && "bg-warning-soft text-warning",
  ),
);
</script>

<template>
  <span :class="classes">{{ method }}</span>
</template>
