import * as v from "valibot";

export const categoryFormSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Category name is required.")),
    description: v.pipe(v.string(), v.trim()),
    status: v.picklist(["active", "inactive"]),
  }),
  v.transform((form) => ({
    ...form,
    description: form.description || null,
  })),
);
