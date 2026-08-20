<script setup lang="ts">
import type { Category } from "~/features/categories/types/categoryTypes";
import type { ProductForm } from "../types/productTypes";

defineProps<{
  categories: Category[];
}>();

const form = defineModel<ProductForm>({ required: true });
</script>

<template>
  <div class="grid gap-3 p-4">
    <div class="grid gap-3 md:grid-cols-2">
      <InputField label="Product Name" v-model="form.name" />

      <InputField label="SKU" v-model="form.sku" />

      <SelectField label="Category" v-model="form.category_id">
        <option value="" disabled>Select category</option>
        <option v-for="category in categories" :key="category.id" :value="String(category.id)">
          {{ category.name }}
        </option>
      </SelectField>

      <InputField label="Selling Price" inputmode="decimal" v-model="form.price" />

      <SelectField label="Status" v-model="form.status">
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </SelectField>
    </div>

    <Textarea label="Description" :rows="4" v-model="form.description" />
  </div>
</template>
