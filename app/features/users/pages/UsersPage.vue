<script setup lang="ts">
import { Archive, Search, UserPlus } from "@lucide/vue";

import { usersApi } from "../api/usersApi";
import type { User } from "../types/userTypes";

const users = ref<User[]>([]);
const search = ref("");
const status = ref("active");
const loading = ref(true);
const savingStatus = ref(false);
const error = ref("");
const successMessage = ref("");
const statusDialogOpen = ref(false);
const selectedUser = ref<User | null>(null);
const pendingStatus = ref<"active" | "inactive" | null>(null);

const auth = useAuthStore();

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

onMounted(() => {
  loadUsers();
});

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

function confirmStatusChange(user: User, status: "active" | "inactive") {
  selectedUser.value = user;
  pendingStatus.value = status;
  error.value = "";
  successMessage.value = "";
  statusDialogOpen.value = true;
}

async function updateStatus() {
  if (savingStatus.value || !selectedUser.value || !pendingStatus.value) {
    return;
  }

  savingStatus.value = true;
  error.value = "";
  successMessage.value = "";

  try {
    const response = await usersApi.updateStatus(selectedUser.value.id, {
      status: pendingStatus.value,
    });

    if (response.data.status === "active") {
      successMessage.value = `The ${response.data.name} account has been reactivated successfully.`;
    } else if (response.data.status === "inactive") {
      successMessage.value = `The ${response.data.name} account has been deactivated successfully.`;
    }

    statusDialogOpen.value = false;
    selectedUser.value = null;
    pendingStatus.value = null;
    await loadUsers();
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to update user status.";
  } finally {
    savingStatus.value = false;
  }
}

function roleLabel(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1);
}
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

    <Alert
      class="mb-4"
      auto-dismiss
      variant="success"
      :message="successMessage"
      v-if="successMessage"
    />

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
        <InputField label="Search" placeholder="Name, phone, email..." v-model="search" />

        <SelectField label="Status" v-model="status">
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
        <template #cell-role="{ row }">
          {{ roleLabel(row.role) }}
        </template>

        <template #cell-email="{ row }">
          {{ row.email ?? "-" }}
        </template>

        <template #cell-status="{ row }">
          <StatusPill :value="row.status" />
        </template>

        <template #cell-actions="{ row }">
          <div class="flex gap-2">
            <Button
              type="button"
              size="icon"
              title="Disable User"
              :disabled="row.id === auth.user?.id"
              @click="confirmStatusChange(row, 'inactive')"
              v-if="row.status === 'active'"
            >
              <span class="sr-only">Disable user</span>
              <Archive :size="16" />
            </Button>

            <Button
              type="button"
              title="Reactivate User"
              @click="confirmStatusChange(row, 'active')"
              v-else
            >
              Activate
            </Button>
          </div>
        </template>
      </DataTable>
    </section>

    <Dialog
      title="Change Account Status"
      subtitle="This affects whether the user can sign in to the app."
      v-model="statusDialogOpen"
    >
      <p class="m-0 text-sm leading-relaxed">
        Are you sure you want to
        <template v-if="pendingStatus === 'active'"> reactivate </template>
        <template v-if="pendingStatus === 'inactive'"> deactivate </template>
        <strong>{{ selectedUser?.name }}</strong
        >?
      </p>

      <Alert :variant="pendingStatus === 'active' ? 'info' : 'error'" class="mt-2">
        <template v-if="pendingStatus === 'active'">
          <ul class="list-disc pl-5">
            <li>The user will be able to sign-in again into the app.</li>
            <li>
              Their data still remains in the system and they will have access to it once they
              sign-in.
            </li>
          </ul>
        </template>

        <template v-else-if="pendingStatus === 'inactive'">
          <ul class="list-disc pl-5">
            <li>The user will be logged out from the app.</li>
            <li>The user will not be able to sign-in into the app.</li>
            <li>
              Their data will remain in the system, but they will not be able to access it until the
              account is reactivated.
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
