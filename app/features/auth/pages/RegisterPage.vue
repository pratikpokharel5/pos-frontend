<script setup lang="ts">
import { safeParse } from "valibot";
import { ReceiptText, UserPlus } from "@lucide/vue";

import { registerFormSchema } from "../validations/registerValidation";

import AuthFeaturePanel from "../components/AuthFeaturePanel.vue";

useHead({
  title: "SalePoint | Register",
});

const form = ref({
  business_name: "",
  owner_name: "",
  phone: "",
  password: "",
});
const loading = ref(false);
const error = ref("");

const auth = useAuthStore();

async function registerBusiness() {
  if (loading.value) {
    return;
  }

  error.value = "";

  const validation = safeParse(registerFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  loading.value = true;

  try {
    await auth.register(validation.output);
    await navigateTo("/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to create account.";

    loading.value = false;
  }
}
</script>

<template>
  <main class="grid min-h-screen place-items-center p-5.5">
    <div
      class="rounded-app border-line bg-surface shadow-app grid w-full max-w-6xl grid-cols-[1.15fr_0.85fr] overflow-hidden border max-[900px]:grid-cols-1"
    >
      <AuthFeaturePanel />

      <form
        class="grid content-center gap-4.5 p-8 max-[640px]:p-5"
        @submit.prevent="registerBusiness"
      >
        <div class="flex items-center gap-3">
          <div
            class="rounded-app grid size-10 place-items-center bg-[linear-gradient(135deg,#3b82f6,#14b8a6)] text-white"
          >
            <ReceiptText :size="24" />
          </div>
          <div>
            <strong class="text-text block text-lg">Create SalePoint Account</strong>
            <span class="text-muted text-sm">Start with your business profile.</span>
          </div>
        </div>

        <Alert variant="error" :message="error" v-if="error" />

        <FormFieldset class="grid gap-3" :submitting="loading">
          <InputField
            label="Business Name"
            autocomplete="organization"
            v-model="form.business_name"
          />

          <InputField label="Owner Name" autocomplete="name" v-model="form.owner_name" />

          <InputField
            type="tel"
            inputmode="tel"
            autocomplete="tel"
            label="Phone"
            v-model="form.phone"
          />

          <InputPassword label="Password" autocomplete="new-password" v-model="form.password" />

          <Button type="submit" variant="primary" :disabled="loading">
            <UserPlus :size="18" />
            {{ loading ? "Creating Account..." : "Create Account" }}
          </Button>
        </FormFieldset>

        <p class="text-muted m-0 text-center text-sm">
          Already have an account?
          <NuxtLink to="/login" class="text-primary font-extrabold no-underline hover:underline">
            Sign In
          </NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>
