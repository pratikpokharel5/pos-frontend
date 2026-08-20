import * as v from "valibot";

export const userFormSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Staff name is required.")),
    email: v.pipe(v.string(), v.trim()),
    phone: v.pipe(v.string(), v.trim(), v.minLength(1, "Phone is required.")),
    password: v.pipe(
      v.string(),
      v.minLength(1, "Password is required."),
      v.minLength(8, "Password must be at least 8 characters."),
    ),
  }),
  v.transform((form) => ({
    name: form.name,
    email: form.email || null,
    phone: form.phone,
    password: form.password,
  })),
);
