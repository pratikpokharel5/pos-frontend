<script setup lang="ts">
import type { CategoryForm } from "../types/categoryTypes";

const form = defineModel<CategoryForm>({ required: true });
</script>

<template>
  <div class="grid gap-3 p-4">
    <div class="grid gap-3 md:grid-cols-2">
      <InputField label="Category Name" v-model="form.name" />

      <SelectField label="Status" v-model="form.status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </SelectField>
    </div>

    <Textarea label="Description" :rows="4" v-model="form.description" />
  </div>
</template>
