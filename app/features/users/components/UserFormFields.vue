<script setup lang="ts">
import type { UserForm } from "../types/userTypes";

const form = defineModel<UserForm>({ required: true });
</script>

<template>
  <div class="grid gap-3 p-4">
    <div class="grid gap-3 md:grid-cols-2">
      <InputField label="Name" v-model="form.name" />

      <InputField label="Email" type="email" inputmode="email" v-model="form.email" />

      <InputField label="Phone" inputmode="tel" v-model="form.phone" />

      <InputPassword label="Password" autocomplete="new-password" v-model="form.password" />
    </div>
  </div>
</template>
