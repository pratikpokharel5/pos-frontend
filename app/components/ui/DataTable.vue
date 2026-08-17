<script setup lang="ts" generic="T extends Record<string, any>">
import type { TableHeader } from "~/types";

withDefaults(
  defineProps<{
    headers: TableHeader[];
    data: T[];
    loading?: boolean;
    loadingLabel?: string;
    emptyTitle?: string;
    emptyDescription?: string;
  }>(),
  {
    loading: false,
    loadingLabel: "Loading data...",
    emptyTitle: "No Data Found",
    emptyDescription: "There are no records to show.",
  },
);
</script>

<template>
  <div class="rounded-app border-line overflow-hidden border">
    <div v-if="loading" class="p-4">
      <LoadingState :label="loadingLabel" />
    </div>

    <div v-else-if="!data || data.length === 0" class="p-4">
      <EmptyState :title="emptyTitle" :description="emptyDescription" />
    </div>

    <div v-else class="overflow-x-auto">
      <table class="bg-surface w-full min-w-[620px] border-collapse md:min-w-190">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              scope="col"
              class="border-line bg-surface-soft text-muted border-b px-3 py-3 text-left align-top text-xs font-extrabold uppercase"
            >
              {{ header.label }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(row, rowIndex) in data" :key="row.id ?? `row-${rowIndex}`">
            <td
              v-for="header in headers"
              :key="header.key"
              :class="
                cn(
                  'text-text px-3 py-3 text-left align-top text-sm',
                  rowIndex !== data.length - 1 && 'border-line border-b',
                )
              "
            >
              <slot
                :name="`cell-${header.key}`"
                :header="header"
                :row="row"
                :row-index="rowIndex"
                :value="row[header.key]"
              >
                {{ row[header.key] ?? "-" }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
