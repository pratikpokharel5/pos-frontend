import * as v from "valibot";

export const productFormSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.trim(), v.minLength(1, "Product name is required.")),
    sku: v.pipe(v.string(), v.trim()),
    category_id: v.string(),
    price: v.string(),
    description: v.pipe(v.string(), v.trim()),
    status: v.picklist(["active", "inactive"]),
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) {
      return;
    }

    const form = dataset.value;
    const price = form.price.trim();

    if (price === "") {
      addIssue({ message: "Selling price is required." });
    } else if (!Number.isFinite(Number(price))) {
      addIssue({ message: "Selling price must be a valid number." });
    } else if (Number(price) < 0) {
      addIssue({ message: "Selling price cannot be negative." });
    }

    if (form.category_id === "") {
      addIssue({ message: "Category is required." });
    }
  }),
  v.transform((form) => ({
    name: form.name,
    sku: form.sku || null,
    category_id: Number(form.category_id),
    price: form.price.trim(),
    description: form.description || null,
    status: form.status,
  })),
);
