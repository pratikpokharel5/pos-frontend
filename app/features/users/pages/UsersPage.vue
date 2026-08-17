<script setup lang="ts">
import { Archive, Search, UserPlus } from "@lucide/vue";

import { usersApi } from "../api/usersApi";
import type { User } from "../types/userTypes";

const users = ref<User[]>([]);
const search = ref("");
const status = ref("");
const loading = ref(true);
const error = ref("");

const auth = useAuthStore();

const tableHeaders = [
  {
    key: "name",
    label: "Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "role",
    label: "Role",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "actions",
    label: "Actions",
  },
];

async function loadUsers() {
  loading.value = true;
  error.value = "";

  try {
    const response = await usersApi.list({
      search: search.value,
      status: status.value,
      per_page: 20,
    });

    users.value = response.data;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to load users.";
  } finally {
    loading.value = false;
  }
}

function searchUsers() {
  loadUsers();
}

async function archiveUser(user: User) {
  error.value = "";

  try {
    await usersApi.archive(user.id);
    await loadUsers();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to disable user.";
  }
}

async function reactivateUser(user: User) {
  error.value = "";

  try {
    await usersApi.update(user.id, {
      name: user.name,
      email: user.email,
      status: "active",
    });
    await loadUsers();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to reactivate user.";
  }
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <section>
    <PageHeader
      eyebrow="Administration"
      title="Manage Users"
      description="Search staff and admins, then disable or reactivate sign-in access."
    >
      <template #actions>
        <Button to="/users/add" variant="primary">
          <UserPlus :size="18" />
          Add New User
        </Button>
      </template>
    </PageHeader>

    <ErrorState class="mb-4" :message="error" v-if="error" />

    <section class="rounded-app border-line bg-surface shadow-app border">
      <div class="border-line flex justify-between gap-3 border-b p-4 max-md:grid">
        <div>
          <h3 class="m-0 text-base font-black">Search Users</h3>
          <p class="text-muted mt-1 mb-0 text-sm">
            Find staff and admins by name, email, or status.
          </p>
        </div>
      </div>

      <form
        class="grid items-end justify-start gap-3 p-4 md:grid-cols-[minmax(260px,360px)_180px_auto]"
        @submit.prevent="searchUsers"
      >
        <InputField label="Search" placeholder="Name or email..." v-model="search" />

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
        :data="users"
        :loading="loading"
        loading-label="Loading users..."
        empty-title="No users found."
        empty-description="Create a staff user or adjust your search filters."
      >
        <template #cell-name="{ row }">
          <strong>{{ row.name }}</strong>
        </template>

        <template #cell-role="{ row }">
          {{ roleLabel(row.role) }}
        </template>

        <template #cell-status="{ row }">
          <StatusPill :value="row.status" />
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <Button
              type="button"
              size="icon"
              title="Disable user"
              :disabled="row.id === auth.user?.id"
              @click="archiveUser(row)"
              v-if="row.status === 'active'"
            >
              <span class="sr-only">Disable user</span>
              <Archive :size="16" />
            </Button>

            <Button type="button" title="Reactivate user" @click="reactivateUser(row)" v-else>
              Activate
            </Button>
          </div>
        </template>
      </DataTable>
    </section>
  </section>
</template>
