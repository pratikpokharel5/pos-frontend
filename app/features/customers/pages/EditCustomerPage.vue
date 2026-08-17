<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { customersApi } from "../api/customersApi";
import { customerFormSchema } from "../validations/customerValidation";
import { parseCustomerId } from "../utils/customerUtils";
import type { CustomerForm } from "../types/customerTypes";

import CustomerFormFields from "../components/CustomerFormFields.vue";

const props = defineProps<{
  customerId: string | undefined;
}>();

const initialCustomer = ref<CustomerForm | null>(null);
const form = ref<CustomerForm | null>(null);
const loading = ref(true);
const saving = ref(false);
const error = ref("");

const customerNumberId = parseCustomerId(props.customerId ?? "");

onMounted(() => {
  loadCustomerForm();
});

async function loadCustomerForm() {
  loading.value = true;
  error.value = "";

  if (customerNumberId === null) {
    error.value = "Invalid customer selected.";
    loading.value = false;
    return;
  }

  try {
    const response = await customersApi.get(customerNumberId);
    const customerForm: CustomerForm = {
      name: response.data.name,
      phone: response.data.phone ?? "",
      email: response.data.email ?? "",
      address: response.data.address ?? "",
      notes: response.data.notes ?? "",
      status: response.data.status,
    };

    initialCustomer.value = { ...customerForm };
    form.value = { ...customerForm };
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load customer.";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  if (initialCustomer.value) {
    form.value = { ...initialCustomer.value };
  }

  error.value = "";
}

async function submit() {
  if (saving.value || !form.value) {
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
    if (customerNumberId === null) {
      throw new Error("Invalid customer selected.");
    }

    await customersApi.update(customerNumberId, validation.output);
    await navigateTo("/customers");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to update customer.";
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading customer form..." full-height v-if="loading" />

  <section v-else-if="!form">
    <PageHeader
      eyebrow="Customers"
      title="Edit Customer"
      description="Update an existing customer record."
    >
      <template #actions>
        <Button to="/customers">
          <ArrowLeft :size="17" />
          Back
        </Button>
      </template>
    </PageHeader>

    <ErrorState :message="error || 'Unable to load customer.'" />
  </section>

  <form @submit.prevent="submit" v-else>
    <PageHeader
      eyebrow="Customers"
      title="Edit Customer"
      description="Update customer details used for lookup and invoices."
    >
      <template #actions>
        <div class="mb-0 flex flex-wrap items-center gap-2.5">
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
