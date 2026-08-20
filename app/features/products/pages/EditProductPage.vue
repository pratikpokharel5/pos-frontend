<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { categoriesApi } from "~/features/categories/api/categoriesApi";
import type { Category } from "~/features/categories/types/categoryTypes";
import { productsApi } from "../api/productsApi";
import { productFormSchema } from "../validations/productValidation";
import { parseProductId } from "../utils/productUtils";
import type { ProductForm } from "../types/productTypes";

import ProductFormFields from "../components/ProductFormFields.vue";

const props = defineProps<{
  productId: string | undefined;
}>();

const categories = ref<Category[]>([]);
const initialProduct = ref<ProductForm | null>(null);
const form = ref<ProductForm | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");

const productNumberId = parseProductId(props.productId ?? "");

onMounted(() => {
  loadProductForm();
});

async function loadProductForm() {
  loading.value = true;
  error.value = "";

  if (productNumberId === null) {
    error.value = "Invalid product selected.";
    loading.value = false;
    return;
  }

  try {
    const [categoryResponse, productResponse] = await Promise.all([
      categoriesApi.list({ status: "active", per_page: 100 }),
      productsApi.get(productNumberId),
    ]);

    const product = productResponse.data;
    const productCategory = product.category;
    const productForm: ProductForm = {
      name: product.name,
      sku: product.sku ?? "",
      category_id: product.category_id ? String(product.category_id) : "",
      price: String(product.price),
      description: product.description ?? "",
      status: product.status,
    };

    categories.value = productCategory
      ? [
          ...categoryResponse.data.filter((category) => category.id !== productCategory.id),
          productCategory,
        ]
      : categoryResponse.data;
    initialProduct.value = { ...productForm };
    form.value = { ...productForm };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load product.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  if (initialProduct.value) {
    form.value = { ...initialProduct.value };
  }

  error.value = "";
}

async function submit() {
  if (saving.value || !form.value) {
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
    if (productNumberId === null) {
      throw new Error("Invalid product selected.");
    }

    await productsApi.update(productNumberId, validation.output);
    await navigateTo("/products");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to update product.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading product form..." full-height v-if="loading" />

  <section v-else-if="!form">
    <PageHeader
      eyebrow="Catalog"
      title="Edit Product"
      description="Update catalog details for an existing product."
    >
      <template #actions>
        <Button to="/products">
          <ArrowLeft :size="17" />
          Back
        </Button>
      </template>
    </PageHeader>

    <ErrorState :message="error || 'Unable to load product.'" />
  </section>

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="Catalog"
      title="Edit Product"
      description="Update catalog details used during sale entry."
    >
      <template #actions>
        <div class="mb-0 flex flex-wrap items-center gap-2.5">
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
