# Frontend Agent Rules

## General

- Keep code simple and clean.
- Do not over-engineer.
- Match the existing coding style and formatting.
- Prefer small, focused changes.
- Do not add abstractions unless they clearly reduce real duplication or complexity.
- Read existing code before changing it.
- Do not revert user changes unless explicitly asked.

## Nuxt And Vue

- Implement features in the Nuxt way, following Nuxt best practices.
- Nuxt built-in functions are auto-imported. Do not manually import `ref`, `computed`, `watch`, `onMounted`, `useHead`, `navigateTo`, `useRoute`, and similar Nuxt/Vue auto-imports.
- Vue component order must be `<script setup>`, `<template>`, then `<style>`.
- Keep components simple and readable.
- Use feature-specific components inside the relevant feature folder.
- Use generic reusable components only when they are truly reusable across the app.

## Feature Structure

- Keep each feature inside `app/features/{feature-name}`.
- For CRUD features, follow the customer feature pattern:
  - `api/{feature}Api.ts`
  - `components/{Feature}FormFields.vue`
  - `pages/{Feature}Page.vue`
  - `pages/Add{Feature}Page.vue`
  - `pages/Edit{Feature}Page.vue`
  - `types/{feature}Types.ts`
  - `utils/{feature}Utils.ts`
  - `validations/{feature}Validation.ts`
- Keep Nuxt route files in `app/pages` as thin wrappers for route metadata, page title, route params, and rendering the feature page.
- Put real page logic inside `app/features/{feature-name}/pages`, not inside `app/pages`.
- Avoid barrel files and barrel imports.
- Import directly from the actual file, such as `../api/customersApi`, `../types/customerTypes`, and `../utils/customerUtils`.

## Styling

- Use Tailwind CSS in components as much as possible.
- Use global CSS only for styles that apply across the whole app.
- Match the existing app design and UI patterns.
- Avoid unnecessary custom CSS when Tailwind is enough.
- Keep UI responsive and avoid horizontal page overflow.

## Forms

- Use manual validation.
- Do not use native `required` attributes when validation is handled manually.
- Do not add unnecessary `name` attributes.
- Use `defineModel` for reusable form input components.
- When a form is submitting, disable the form and its buttons.
- Use one feature form-fields component for add and edit forms when both pages share the same fields.
- Keep empty form state beside the form type in the feature types file.
- In edit pages, keep `initial{Feature}` and `form` states so reset restores loaded data instead of an empty form.
- Use `safeParse()` before submitting forms.

## Data And API

- Use the app's Nuxt API helper pattern.
- Keep payload transforms close to validation when form values need to match backend API expectations.
- Keep numeric form inputs as strings in the UI, then transform after validation when needed.
- Do not make typing complex unless the complexity solves a real problem.
- Keep feature API methods in a clearly named API file, such as `api/customersApi.ts`.
- Use simple API method names like `list`, `get`, `create`, `update`, and `archive`.
- Use shared API wrapper types such as `ApiCollection<T>`, `ApiResource<T>`, and `Query`.
- Use `cleanQueryParams(query)` before sending list filters.
- Keep backend resource type, form type, and payload type together in the feature types file.
- Backend resource types should match API responses. Form types should match UI field values. Payload types should match backend request payloads.
- Keep empty optional fields as strings in the UI, then transform them to `null` for the backend when needed.
- Frontend required fields must match backend validation. If the backend returns a field as required or non-null, the frontend type should not allow `null`.
- Frontend API response types, form payload types, backend API resources, backend validation, and final database migration shape must stay consistent with each other.

## List Pages

- Keep static table headers as a plain constant, not a computed property.
- Keep filter state simple, such as `search`, `status`, `loading`, and `error`.
- Load initial table data with `onMounted`.
- Submit filter forms with `@submit.prevent`.
- Use `DataTable` with slots for custom cells.
- Add `title` attributes to table action buttons.

## Verification

- Run `pnpm.cmd lint` after frontend changes.
- Run `pnpm.cmd build` when changing pages, components, routing, validation, or payload types.
