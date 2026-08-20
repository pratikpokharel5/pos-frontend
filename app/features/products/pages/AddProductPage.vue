<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { categoriesApi } from "~/features/categories/api/categoriesApi";
import type { Category } from "~/features/categories/types/categoryTypes";
import { productsApi } from "../api/productsApi";
import { productFormSchema } from "../validations/productValidation";
import { emptyProductForm } from "../types/productTypes";

import ProductFormFields from "../components/ProductFormFields.vue";

const categories = ref<Category[]>([]);
const form = ref({ ...emptyProductForm });
const loading = ref(true);
const saving = ref(false);
const error = ref("");

onMounted(() => {
  loadCategories();
});

async function loadCategories() {
  loading.value = true;
  error.value = "";

  try {
    const response = await categoriesApi.list({
      status: "active",
      per_page: 100,
    });

    categories.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load categories.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = { ...emptyProductForm };
  error.value = "";
}

async function submit() {
  if (saving.value) {
    return;
  }

  error.value = "";

  const validation = safeParse(productFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    await productsApi.create(validation.output);
    await navigateTo("/products");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save product.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading product form..." full-height v-if="loading" />

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="Catalog"
      title="Add Product"
      description="Create a catalog item that can be selected quickly during sale entry."
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2.5">
          <Button to="/products">
            <ArrowLeft :size="17" />
            Back
          </Button>

          <FormFieldset class="flex flex-wrap items-center gap-2.5" :submitting="saving">
            <Button type="button" @click="resetForm">
              <RotateCcw :size="17" />
              Reset
            </Button>

            <Button type="submit" variant="primary">
              <Save :size="18" />
              Save Product
            </Button>
          </FormFieldset>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app max-w-full border">
      <FormFieldset :submitting="saving">
        <ProductFormFields :categories="categories" v-model="form" />
      </FormFieldset>
    </section>
  </form>
</template>
