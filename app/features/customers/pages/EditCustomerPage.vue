<script setup lang="ts">
import { safeParse } from "valibot";
import { ArrowLeft, RotateCcw, Save } from "@lucide/vue";

import { customersApi } from "../api/customersApi";
import { customerFormSchema } from "../validations/customerValidation";
import { parseCustomerId } from "../utils/customerUtils";
import type { CustomerForm, Status } from "../types/customerTypes";

import CustomerFormFields from "../components/CustomerFormFields.vue";

const props = defineProps<{
  id: string;
}>();

const initialCustomer = ref<CustomerForm | null>(null);
const form = ref<CustomerForm | null>(null);
const customerStatus = ref<Status>("active");
const pendingStatus = ref<Status | null>(null);
const loading = ref(true);
const saving = ref(false);
const savingStatus = ref(false);
const statusDialogOpen = ref(false);
const error = ref("");
const statusError = ref("");
const successMessage = ref("");

const authStore = useAuthStore();

const customerId = parseCustomerId(props.id);

onMounted(() => {
  loadCustomerForm();
});

async function loadCustomerForm() {
  loading.value = true;
  error.value = "";

  if (customerId === null) {
    error.value = "Invalid customer selected.";
    loading.value = false;
    return;
  }

  try {
    const response = await customersApi.get(customerId);

    const customerForm: CustomerForm = {
      name: response.data.name,
      phone: response.data.phone,
      email: response.data.email ?? "",
      address: response.data.address ?? "",
      notes: response.data.notes ?? "",
    };

    initialCustomer.value = { ...customerForm };
    form.value = { ...customerForm };
    customerStatus.value = response.data.status;
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
  successMessage.value = "";
}

async function submit() {
  if (saving.value || !form.value) {
    return;
  }

  error.value = "";
  successMessage.value = "";

  const validation = safeParse(customerFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  saving.value = true;

  try {
    if (customerId === null) {
      throw new Error("Invalid customer selected.");
    }

    const response = await customersApi.update(customerId, validation.output);

    const customerForm: CustomerForm = {
      name: response.data.name,
      phone: response.data.phone,
      email: response.data.email ?? "",
      address: response.data.address ?? "",
      notes: response.data.notes ?? "",
    };

    initialCustomer.value = { ...customerForm };
    form.value = { ...customerForm };
    successMessage.value = "Customer details have been updated.";
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to update customer.";
  } finally {
    saving.value = false;
  }
}

function confirmStatusChange(status: Status) {
  pendingStatus.value = status;
  statusError.value = "";
  successMessage.value = "";
  statusDialogOpen.value = true;
}

async function updateStatus() {
  if (savingStatus.value || customerId === null || pendingStatus.value === null) {
    return;
  }

  savingStatus.value = true;
  statusError.value = "";

  try {
    const response = await customersApi.updateStatus(customerId, {
      status: pendingStatus.value,
    });

    customerStatus.value = response.data.status;

    if (customerStatus.value === "active") {
      successMessage.value = "The account has been reactivated successfully.";
    } else if (customerStatus.value === "inactive") {
      successMessage.value = "The account has been deactivated successfully.";
    }

    pendingStatus.value = null;
    statusDialogOpen.value = false;
  } catch (err) {
    statusError.value = err instanceof Error ? err.message : "Unable to update status.";
  } finally {
    savingStatus.value = false;
  }
}
</script>

<template>
  <LoadingState label="Loading customer form..." v-if="loading" />

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

  <section v-else>
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

            <Button type="button" variant="primary" @click="submit">
              <Save :size="18" />
              {{ saving ? "Saving..." : "Save Customer" }}
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

    <form @submit.prevent="submit">
      <section class="rounded-app border-line bg-surface shadow-app max-w-full border">
        <FormFieldset :submitting="saving">
          <CustomerFormFields v-model="form" />
        </FormFieldset>
      </section>
    </form>

    <section
      class="rounded-app border-line bg-surface shadow-app mt-4 max-w-full border p-4"
      v-if="authStore.isAdmin"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 class="m-0 text-base font-black">Customer Status</h3>
          <p class="text-muted mt-1 mb-0 text-sm">
            Change whether this customer can be used for new sales.
          </p>
        </div>

        <StatusPill :value="customerStatus" />
      </div>

      <ErrorState class="mt-4" :message="statusError" v-if="statusError" />

      <div class="mt-4 flex flex-wrap gap-2">
        <Button
          variant="primary"
          :disabled="savingStatus"
          @click="confirmStatusChange(customerStatus === 'active' ? 'inactive' : 'active')"
        >
          Change Status
        </Button>
      </div>
    </section>

    <Dialog
      title="Change Customer Status"
      subtitle="This affects whether the customer can be selected for new sales."
      v-model="statusDialogOpen"
    >
      <p class="m-0 text-sm leading-relaxed">
        Are you sure you want to
        <template v-if="pendingStatus === 'active'"> reactivate </template>
        <template v-else-if="pendingStatus === 'inactive'"> deactivate </template>
        <strong>{{ form.name }}</strong
        >?
      </p>

      <Alert :variant="pendingStatus === 'active' ? 'info' : 'error'" class="mt-2">
        <template v-if="pendingStatus === 'active'">
          This customer will be available for selection when creating new sales.
        </template>

        <template v-else-if="pendingStatus === 'inactive'">
          <ul class="list-disc pl-5">
            <li>The customer will not be available for selection when creating new sales.</li>
            <li>
              Existing records for the customer can be viewed and can appear in sales reports.
            </li>
          </ul>
        </template>
      </Alert>

      <template #footer>
        <Button :disabled="savingStatus" @click="statusDialogOpen = false">Cancel</Button>

        <Button variant="primary" :disabled="savingStatus" @click="updateStatus">
          {{ savingStatus ? "Saving..." : "Confirm" }}
        </Button>
      </template>
    </Dialog>
  </section>
</template>
