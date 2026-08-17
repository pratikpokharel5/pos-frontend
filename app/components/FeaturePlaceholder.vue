<script setup lang="ts">
defineProps<{
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  primaryTo?: string;
  primaryLabel?: string;
}>();
</script>

<template>
  <section>
    <PageHeader :title="title" :description="description">
      <template v-if="primaryTo && primaryLabel" #actions>
        <Button :to="primaryTo" variant="primary" type="button">{{ primaryLabel }}</Button>
      </template>
    </PageHeader>

    <div class="rounded-app border-line bg-surface shadow-app border">
      <div class="p-4">
        <EmptyState :title="emptyTitle" :description="emptyDescription" />
      </div>
    </div>
  </section>
</template>
