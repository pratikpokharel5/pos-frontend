<script setup lang="ts">
withDefaults(
  defineProps<{
    submitting?: boolean;
  }>(),
  {
    submitting: false,
  },
);
</script>

<template>
  <fieldset class="m-0 border-0 p-0 disabled:opacity-70" :disabled="submitting">
    <slot />
  </fieldset>
</template>
