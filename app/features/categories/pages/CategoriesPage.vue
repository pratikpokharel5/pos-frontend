<script setup lang="ts">
import { Pen, Plus, Search, Upload } from "@lucide/vue";

import { categoriesApi } from "../api/categoriesApi";
import type { Category, CategoryImportResult } from "../types/categoryTypes";

const categories = ref<Category[]>([]);
const search = ref("");
const status = ref("");
const loading = ref(true);
const error = ref("");
const importing = ref(false);
const importDialogOpen = ref(false);
const importFile = ref<File | null>(null);
const importError = ref("");
const importResult = ref<CategoryImportResult | null>(null);

const auth = useAuthStore();

const tableHeaders = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "status",
    label: "Status",
  },
];

if (auth.isAdmin) {
  tableHeaders.push({
    key: "actions",
    label: "Actions",
  });
}

async function loadCategories() {
  loading.value = true;
  error.value = "";

  try {
    const response = await categoriesApi.list({
      search: search.value,
      status: status.value,
      per_page: 20,
    });

    categories.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load categories.";
  } finally {
    loading.value = false;
  }
}

function searchCategories() {
  loadCategories();
}

function openImportDialog() {
  importDialogOpen.value = true;
  importFile.value = null;
  importError.value = "";
  importResult.value = null;
}

async function importCategories() {
  if (!importFile.value || importing.value) {
    return;
  }

  importError.value = "";
  importResult.value = null;

  importing.value = true;

  try {
    const response = await categoriesApi.import(importFile.value);

    importResult.value = response.data;
    await loadCategories();
  } catch (err) {
    importError.value = err instanceof Error ? err.message : "Unable to import categories.";
  } finally {
    importing.value = false;
  }
}

onMounted(() => {
  loadCategories();
});
</script>

<template>
  <Dialog
    title="Import Categories"
    subtitle="Upload an Excel file with category data."
    v-model="importDialogOpen"
  >
    <div class="grid gap-4">
      <FileInput
        label="Excel File"
        accept=".xlsx,.xls"
        description="Expected columns: name, description, status."
        :disabled="importing"
        v-model="importFile"
      />

      <ErrorState :message="importError" v-if="importError" />

      <div
        class="rounded-app border-line bg-surface-soft grid gap-2 border p-3"
        v-if="importResult"
      >
        <strong class="text-text text-sm">Import Summary</strong>

        <div class="grid gap-2 text-sm sm:grid-cols-3">
          <span>Created: {{ importResult.created }}</span>
          <span>Updated: {{ importResult.updated }}</span>
          <span>Skipped: {{ importResult.skipped }}</span>
        </div>

        <div class="grid gap-1" v-if="importResult.errors?.length">
          <strong class="text-danger text-sm">Rows with errors</strong>
          <p
            class="text-muted m-0 text-sm"
            v-for="issue in importResult.errors"
            :key="`${issue.row}-${issue.message}`"
          >
            Row {{ issue.row }}: {{ issue.message }}
          </p>
        </div>
      </div>
    </div>

    <template #footer>
      <Button type="button" :disabled="importing" @click="importDialogOpen = false"> Close </Button>

      <Button
        type="button"
        variant="primary"
        :disabled="!importFile || importing"
        @click="importCategories"
      >
        <Upload :size="17" />
        {{ importing ? "Importing..." : "Import Categories" }}
      </Button>
    </template>
  </Dialog>

  <section>
    <PageHeader
      eyebrow="Catalog"
      title="Categories"
      description="Group products into simple categories for faster browsing."
    >
      <template #actions v-if="auth.isAdmin">
        <div class="flex flex-wrap gap-2">
          <Button type="button" @click="openImportDialog">
            <Upload :size="18" />
            Import
          </Button>

          <Button to="/categories/add" variant="primary">
            <Plus :size="18" />
            Add Category
          </Button>
        </div>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Search Categories</h3>
          <p class="text-muted mt-1 mb-0 text-sm">Find categories by name or status.</p>
        </div>
      </div>

      <form
        class="grid items-end justify-start gap-3 p-4 md:grid-cols-[minmax(260px,360px)_180px_auto]"
        @submit.prevent="searchCategories"
      >
        <InputField label="Search" placeholder="Electronics, clothing..." v-model="search" />

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
        :data="categories"
        :loading="loading"
        loading-label="Loading categories..."
        empty-title="No categories found."
        empty-description="Add categories when you want to group products."
      >
        <template #cell-name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>

        <template #cell-status="{ row }">
          <StatusPill :value="row.status" />
        </template>

        <template #cell-actions="{ row }">
          <Button
            :to="`/categories/${row.id}/edit`"
            size="icon"
            title="Edit category"
            v-if="auth.isAdmin"
          >
            <span class="sr-only">Edit category</span>
            <Pen :size="16" />
          </Button>
        </template>
      </DataTable>
    </section>
  </section>
</template>
