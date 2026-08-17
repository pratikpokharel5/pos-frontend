<template>
  <div class="min-h-screen bg-gray-100 px-4 py-5 text-black">
    <slot />
  </div>
</template>

<style>
@media print {
  @page {
    margin: 14mm;
  }

  html,
  body {
    background: #ffffff !important;
  }

  body {
    color: #000000 !important;
  }

  .no-print {
    display: none !important;
  }
}
</style>
