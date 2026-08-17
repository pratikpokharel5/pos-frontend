<script setup lang="ts">
import {
  Boxes,
  Users,
  LogOut,
  History,
  Settings,
  BarChart3,
  FolderTree,
  ReceiptText,
  ShoppingCart,
  UserRoundCog,
  PanelLeftOpen,
  PanelLeftClose,
  LayoutDashboard,
} from "@lucide/vue";

const collapsed = ref(false);

const auth = useAuthStore();

const sidebarClasses = computed(() =>
  cn(
    "border-line bg-sidebar text-sidebar-text sticky top-0 hidden h-screen border-r transition-[width] duration-200 md:grid md:grid-rows-[auto_1fr_auto]",
    collapsed.value ? "w-19" : "w-54",
  ),
);

const sidebarToggleClasses = computed(() =>
  cn(
    "rounded-app border-line-strong bg-surface text-text hover:border-primary mx-3 mb-3 inline-flex h-10 items-center justify-start gap-2 overflow-hidden border text-sm font-extrabold transition",
    collapsed.value ? "w-10 self-center" : "w-[calc(100%-1.5rem)]",
  ),
);

const navItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "New Sale", to: "/sales/new", icon: ShoppingCart },
  { label: "Categories", to: "/categories", icon: FolderTree },
  { label: "Products", to: "/products", icon: Boxes },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Users", to: "/users", icon: UserRoundCog, isAdmin: true },
  { label: "Sales History", to: "/sales", icon: History },
  { label: "Reports", to: "/reports", icon: BarChart3 },
  { label: "Settings", to: "/settings", icon: Settings, isAdmin: true },
];
</script>

<template>
  <div class="bg-bg text-text grid min-h-screen md:grid-cols-[auto_1fr]">
    <aside :class="sidebarClasses">
      <div class="border-line flex h-16 items-center gap-3 border-b px-4">
        <span class="rounded-app bg-primary grid size-9 shrink-0 place-items-center text-white">
          <ReceiptText :size="22" />
        </span>

        <strong class="truncate text-lg" v-if="!collapsed">SalePoint</strong>
      </div>

      <nav class="grid content-start gap-1 p-3">
        <template v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            active-class="bg-sidebar-soft text-primary"
            class="group rounded-app text-muted hover:bg-sidebar-soft hover:text-sidebar-text grid min-h-11 grid-cols-[40px_1fr] items-center px-1 text-sm font-bold no-underline"
            v-if="!item.isAdmin || auth.isAdmin"
          >
            <span class="grid size-10 place-items-center">
              <component :is="item.icon" :size="18" />
            </span>

            <span class="truncate" v-if="!collapsed">{{ item.label }}</span>
          </NuxtLink>
        </template>
      </nav>

      <button
        type="button"
        title="Toggle sidebar"
        :class="sidebarToggleClasses"
        :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        @click="collapsed = !collapsed"
      >
        <span class="grid size-10 shrink-0 place-items-center">
          <PanelLeftClose v-if="!collapsed" :size="18" />
          <PanelLeftOpen v-else :size="18" />
        </span>

        <span v-if="!collapsed" class="text-left text-sm font-bold">Collapse</span>
      </button>
    </aside>

    <div class="min-w-0">
      <header
        class="border-line bg-bg/95 sticky top-0 z-20 min-w-0 overflow-hidden border-b px-3 py-3 backdrop-blur md:px-4"
      >
        <div class="flex items-center justify-between gap-3">
          <div class="min-w-0">
            <strong class="block truncate">{{ auth.businessName }}</strong>
            <span class="text-muted block truncate text-xs">User: {{ auth.user?.name }}</span>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <Button class="md:hidden" to="/sales/new" variant="primary" type="button">
              <ShoppingCart :size="17" />
              Sale
            </Button>

            <Button
              type="button"
              size="icon"
              title="Logout"
              variant="danger"
              aria-label="Logout"
              @click="auth.logout()"
            >
              <LogOut :size="18" />
            </Button>
          </div>
        </div>

        <nav class="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1 md:hidden">
          <template v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              active-class="border-primary bg-primary-soft text-primary-strong"
              class="border-line bg-surface text-muted rounded-app inline-flex min-h-10 shrink-0 items-center gap-2 border px-3 text-sm font-bold no-underline"
              v-if="!item.isAdmin || auth.isAdmin"
            >
              <component :is="item.icon" :size="16" />
              {{ item.label }}
            </NuxtLink>
          </template>
        </nav>
      </header>

      <main class="px-3 py-4 sm:px-4 sm:py-5">
        <slot />
      </main>
    </div>
  </div>
</template>
