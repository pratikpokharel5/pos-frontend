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

## Data And API

- Use the app's Nuxt API helper pattern.
- Keep payload transforms close to validation when form values need to match backend API expectations.
- Keep numeric form inputs as strings in the UI, then transform after validation when needed.
- Do not make typing complex unless the complexity solves a real problem.

## Verification

- Run `pnpm.cmd lint` after frontend changes.
- Run `pnpm.cmd build` when changing pages, components, routing, validation, or payload types.
