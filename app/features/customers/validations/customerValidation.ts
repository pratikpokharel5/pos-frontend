import * as v from "valibot";

export const customerFormSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Customer name is required.")),
    phone: v.pipe(v.string(), v.trim()),
    email: v.pipe(v.string(), v.trim()),
    address: v.pipe(v.string(), v.trim()),
    notes: v.pipe(v.string(), v.trim()),
    status: v.picklist(["active", "inactive"]),
  }),
  v.transform((form) => ({
    name: form.name,
    phone: form.phone || null,
    email: form.email || null,
    address: form.address || null,
    notes: form.notes || null,
    status: form.status,
  })),
);
