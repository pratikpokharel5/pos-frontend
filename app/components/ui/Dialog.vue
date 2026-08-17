<script setup lang="ts">
import { X } from "@lucide/vue";

const props = defineProps<{
  title: string;
  subtitle?: string;
}>();

const open = defineModel<boolean>({ required: true });

const titleId = useId();
const subtitleId = useId();

function closeDialog() {
  open.value = false;
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      v-if="open"
      @click.self="closeDialog"
    >
      <section
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        :aria-describedby="props.subtitle ? subtitleId : undefined"
        class="rounded-app border-line bg-surface shadow-app grid max-h-[calc(100vh-2rem)] w-full max-w-xl overflow-hidden border"
      >
        <header class="border-line flex items-start justify-between gap-4 border-b p-4">
          <div>
            <h2 :id="titleId" class="text-text m-0 text-lg font-black">{{ title }}</h2>
            <p :id="subtitleId" class="text-muted m-0 mt-1 text-sm" v-if="subtitle">
              {{ subtitle }}
            </p>
          </div>

          <button
            type="button"
            class="rounded-app text-muted hover:bg-surface-soft hover:text-text focus-visible:ring-primary grid size-9 shrink-0 place-items-center transition focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Close dialog"
            @click="closeDialog"
          >
            <X :size="18" />
          </button>
        </header>

        <div class="overflow-y-auto p-4">
          <slot />
        </div>

        <footer
          class="border-line flex flex-wrap justify-end gap-2 border-t p-4"
          v-if="$slots.footer"
        >
          <slot name="footer" />
        </footer>
      </section>
    </div>
  </Teleport>
</template>
