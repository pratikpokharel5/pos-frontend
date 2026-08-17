<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { categoriesApi } from "../api/index.ts";
import { categoryFormSchema } from "../validations/categoryValidation";
import { emptyCategoryForm } from "../types/index.ts";

import CategoryFormFields from "../components/CategoryFormFields.vue";

const form = ref({ ...emptyCategoryForm });
const saving = ref(false);
const error = ref("");

function resetForm() {
  form.value = { ...emptyCategoryForm };
  error.value = "";
}

async function submit() {
  if (saving.value) {
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
    await categoriesApi.create(validation.output);
    await navigateTo("/categories");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save category.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <PageHeader
      eyebrow="Catalog"
      title="Add Category"
      description="Create a category to keep your product catalog easier to browse."
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2.5">
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
