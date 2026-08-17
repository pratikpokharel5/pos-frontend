<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { customersApi } from "../api/customersApi";
import { customerFormSchema } from "../validations/customerValidation";
import { emptyCustomerForm } from "../types/customerTypes";

import CustomerFormFields from "../components/CustomerFormFields.vue";

const form = ref({ ...emptyCustomerForm });
const saving = ref(false);
const error = ref("");

function resetForm() {
  form.value = { ...emptyCustomerForm };
  error.value = "";
}

async function submit() {
  if (saving.value) {
    return;
  }

  error.value = "";

  const validation = safeParse(customerFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    await customersApi.create(validation.output);
    await navigateTo("/customers");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to save customer.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="submit">
    <PageHeader
      eyebrow="Customers"
      title="Add Customer"
      description="Create a customer record for faster lookup during future sales."
    >
      <template #actions>
        <div class="flex flex-wrap items-center gap-2.5">
          <Button to="/customers">
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
              Save Customer
            </Button>
          </FormFieldset>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app max-w-full border">
      <FormFieldset :submitting="saving">
        <CustomerFormFields v-model="form" />
      </FormFieldset>
    </section>
  </form>
</template>
