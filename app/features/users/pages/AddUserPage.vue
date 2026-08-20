<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { usersApi } from "../api/usersApi";
import { userFormSchema } from "../validations/userValidation";
import { emptyUserForm } from "../types/userTypes";

import UserFormFields from "../components/UserFormFields.vue";

const form = ref({ ...emptyUserForm });
const saving = ref(false);
const error = ref("");
const successMessage = ref("");

function resetForm() {
  form.value = { ...emptyUserForm };
  error.value = "";
  successMessage.value = "";
}

async function submit() {
  if (saving.value) {
    return;
  }

  error.value = "";
  successMessage.value = "";

  const validation = safeParse(userFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    await usersApi.create(validation.output);

    form.value = { ...emptyUserForm };
    successMessage.value = "User has been created.";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save user.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <PageHeader
      eyebrow="Administration"
      title="Add New User"
      description="Create a staff account that can sign in and handle counter workflows."
    >
      <template #actions>
        <div class="mb-0 flex flex-wrap items-center gap-2.5">
          <Button to="/users">
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
              {{ saving ? "Saving..." : "Save User" }}
            </Button>
          </FormFieldset>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <Alert
      class="mb-4"
      auto-dismiss
      variant="success"
      :message="successMessage"
      v-if="successMessage"
    />

    <section class="rounded-app border-line bg-surface shadow-app max-w-full border">
      <FormFieldset :submitting="saving">
        <UserFormFields v-model="form" />
      </FormFieldset>
    </section>
  </form>
</template>
