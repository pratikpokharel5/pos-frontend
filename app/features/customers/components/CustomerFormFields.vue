<script setup lang="ts">
import type { CustomerForm } from "../types/customerTypes";

const form = defineModel<CustomerForm>({ required: true });
</script>

<template>
  <div class="grid gap-3 p-4">
    <div class="grid gap-3 md:grid-cols-2">
      <InputField label="Customer Name" v-model="form.name" />

      <InputField label="Phone" inputmode="tel" v-model="form.phone" />

      <InputField label="Email" type="email" inputmode="email" v-model="form.email" />

      <InputField label="Address" v-model="form.address" />
    </div>

    <Textarea label="Notes" :rows="4" v-model="form.notes" />
  </div>
</template>
