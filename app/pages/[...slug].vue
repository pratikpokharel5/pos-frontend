<script setup lang="ts">
definePageMeta({
  layout: "error",
});

useHead({
  title: "SalePoint | Page Not Found",
});
</script>

<template>
  <section class="grid max-w-md gap-4 text-center">
    <p class="text-primary m-0 text-xs font-extrabold tracking-[0.12em] uppercase">404</p>

    <div class="grid gap-2">
      <h1 class="text-text m-0 text-3xl font-black">Page Not Found</h1>
      <p class="text-muted m-0 text-sm leading-relaxed">
        The page you are looking for does not exist or has been moved.
      </p>
    </div>

    <div class="flex justify-center gap-2">
      <Button to="/dashboard" variant="primary">Go To Dashboard</Button>
      <Button to="/">Go Home</Button>
    </div>
  </section>
</template>
