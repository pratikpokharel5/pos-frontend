<script setup lang="ts">
import { safeParse } from "valibot";
import { LogIn, ReceiptText } from "@lucide/vue";

import { loginFormSchema } from "../validations/loginValidation";

import AuthFeaturePanel from "../components/AuthFeaturePanel.vue";

useHead({
  title: "SalePoint | Login",
});

const form = ref({ email: "", password: "" });
const loading = ref(false);
const error = ref("");

const auth = useAuthStore();
const route = useRoute();

async function loginUser() {
  if (loading.value) {
    return;
  }

  error.value = "";

  const validation = safeParse(loginFormSchema, form.value);

  if (!validation.success) {
    error.value = getFormValidationErrors(validation.issues);
    return;
  }

  loading.value = true;

  try {
    await auth.login(validation.output);

    const redirect = route.query.redirect;

    await navigateTo(typeof redirect === "string" ? redirect : "/dashboard");
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Unable to login.";
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

      <form class="grid content-center gap-4.5 p-8 max-[640px]:p-5" @submit.prevent="loginUser">
        <div class="flex items-center gap-3">
          <div
            class="rounded-app grid size-10 place-items-center bg-[linear-gradient(135deg,#3b82f6,#14b8a6)] text-white"
          >
            <ReceiptText :size="24" />
          </div>
          <div>
            <strong class="text-text block text-lg">SalePoint</strong>
            <span class="text-muted text-sm">Built for small business selling.</span>
          </div>
        </div>

        <Alert variant="error" :message="error" v-if="error" />

        <FormFieldset class="grid gap-3" :submitting="loading">
          <InputField label="Email Or Phone" autocomplete="username" v-model="form.email" />

          <InputPassword label="Password" autocomplete="current-password" v-model="form.password" />
          <!-- 
          <NuxtLink
            to="/"
            class="text-primary justify-self-end text-sm font-extrabold no-underline hover:underline"
          >
            Forgot password?
          </NuxtLink> -->

          <Button type="submit" variant="primary" :disabled="loading">
            <LogIn :size="18" />
            {{ loading ? "Signing In..." : "Sign In" }}
          </Button>
        </FormFieldset>

        <p class="text-muted m-0 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary font-extrabold no-underline hover:underline">
            Get Started
          </NuxtLink>
        </p>
      </form>
    </div>
  </main>
</template>
