<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { categoriesApi } from "../api/index.ts";
import { categoryFormSchema } from "../validations/categoryValidation";
import { parseCategoryId } from "../utils/index.ts";
import type { CategoryForm } from "../types/index.ts";

import CategoryFormFields from "../components/CategoryFormFields.vue";

const props = defineProps<{
  id: string | undefined;
}>();

const initialCategory = ref<CategoryForm | null>(null);
const form = ref<CategoryForm | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");

const categoryId = parseCategoryId(props.id);

onMounted(() => {
  loadCategoryForm();
});

async function loadCategoryForm() {
  loading.value = true;
  error.value = "";

  if (categoryId === null) {
    error.value = "Invalid category selected.";
    loading.value = false;
    return;
  }

  try {
    const response = await categoriesApi.get(categoryId);

    const data: CategoryForm = {
      name: response.data.name,
      description: response.data.description ?? "",
      status: response.data.status,
    };

    initialCategory.value = { ...data };
    form.value = { ...data };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load category.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  if (initialCategory.value) {
    form.value = { ...initialCategory.value };
  }

  error.value = "";
}

async function submit() {
  if (saving.value || !form.value) {
    return;
  }

  error.value = "";

  const validation = safeParse(categoryFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    if (categoryId === null) {
      throw new Error("Invalid category selected.");
    }

    await categoriesApi.update(categoryId, validation.output);
    await navigateTo("/categories");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to update category.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading category form..." full-height v-if="loading" />

  <section v-else-if="!form">
    <PageHeader
      eyebrow="Catalog"
      title="Edit Category"
      description="Update an existing catalog category."
    >
      <template #actions>
        <Button to="/categories">
          <ArrowLeft :size="17" />
          Back
        </Button>
      </template>
    </PageHeader>

    <ErrorState :message="error || 'Unable to load category.'" />
  </section>

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="Catalog"
      title="Edit Category"
      description="Update how this category appears in the product catalog."
    >
      <template #actions>
        <div class="mb-0 flex flex-wrap items-center gap-2.5">
          <Button to="/categories">
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
              Save Category
            </Button>
          </FormFieldset>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app max-w-full border">
      <FormFieldset :submitting="saving">
        <CategoryFormFields v-model="form" />
      </FormFieldset>
    </section>
  </form>
</template>
