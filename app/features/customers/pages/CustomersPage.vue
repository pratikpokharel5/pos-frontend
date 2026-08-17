<script setup lang="ts">
import { Pen, Plus, Search } from "@lucide/vue";

import { customersApi } from "../api/customersApi";
import type { Customer } from "../types/customerTypes";

const customers = ref<Customer[]>([]);
const search = ref("");
const status = ref("");
const loading = ref(true);
const error = ref("");

const tableHeaders = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "phone",
    label: "Phone",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "notes",
    label: "Notes",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

async function loadCustomers() {
  loading.value = true;
  error.value = "";

  try {
    const response = await customersApi.list({
      search: search.value,
      status: status.value,
      per_page: 20,
    });

    customers.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load customers.";
  } finally {
    loading.value = false;
  }
}

function searchCustomers() {
  loadCustomers();
}

onMounted(() => {
  loadCustomers();
});
</script>

<template>
  <section>
    <PageHeader
      eyebrow="Customers"
      title="Customer Records"
      description="Keep optional customer details for repeat visits, invoices, and lookup."
    >
      <template #actions>
        <Button to="/customers/add" variant="primary">
          <Plus :size="18" />
          Add Customer
        </Button>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Search Customers</h3>
          <p class="text-muted mt-1 mb-0 text-sm">Find customers by name, phone, or email.</p>
        </div>
      </div>

      <form
        class="grid items-end justify-start gap-3 p-4 md:grid-cols-[minmax(260px,360px)_180px_auto]"
        @submit.prevent="searchCustomers"
      >
        <InputField label="Search" placeholder="Name, phone, email..." v-model="search" />

        <SelectField label="Status" v-model="status">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </SelectField>

        <Button type="submit" :disabled="loading">
          <Search :size="17" />
          Apply
        </Button>
      </form>
    </section>

    <section class="rounded-app border-line bg-surface shadow-app mt-4 border p-4">
      <DataTable
        :headers="tableHeaders"
        :data="customers"
        :loading="loading"
        loading-label="Loading customers..."
        empty-title="No customers found."
        empty-description="You can still create walk-in sales without customer details."
      >
        <template #cell-name="{ row }">
          <div>
            <strong>{{ row.name }}</strong>
            <p class="text-muted mt-1 mb-0 text-sm" v-if="row.address">
              {{ row.address }}
            </p>
          </div>
        </template>

        <template #cell-phone="{ row }">
          {{ row.phone ?? "-" }}
        </template>

        <template #cell-email="{ row }">
          {{ row.email ?? "-" }}
        </template>

        <template #cell-status="{ row }">
          <StatusPill :value="row.status" />
        </template>

        <template #cell-notes="{ row }">
          {{ row.notes ?? "-" }}
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <Button :to="`/customers/${row.id}/edit`" size="icon" title="Edit customer">
              <span class="sr-only">Edit customer</span>
              <Pen :size="16" />
            </Button>
          </div>
        </template>
      </DataTable>
    </section>
  </section>
</template>
