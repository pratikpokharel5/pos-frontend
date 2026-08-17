import * as v from "valibot";

const nullableStringSchema = v.union([v.string(), v.null()]);

export const settingsFormSchema = v.pipe(
  v.object({
    business_name: v.pipe(v.string(), v.trim(), v.minLength(1, "Business name is required.")),
    logo: nullableStringSchema,
    address: nullableStringSchema,
    phone: v.pipe(v.string(), v.trim(), v.minLength(1, "Phone is required.")),
    email: nullableStringSchema,
    tax_enabled: v.boolean(),
    default_tax_rate: v.union([v.string(), v.number()]),
    online_payment_enabled: v.boolean(),
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) {
      return;
    }

    const defaultTaxRate = numberValue(dataset.value.default_tax_rate);

    if (defaultTaxRate < 0 || defaultTaxRate > 100) {
      addIssue({ message: "Default tax rate must be between 0 and 100%." });
    }
  }),
  v.transform((settings) => ({
    business_name: settings.business_name,
    logo: settings.logo?.trim() || null,
    address: settings.address?.trim() || null,
    phone: settings.phone,
    email: settings.email?.trim() || null,
    tax_enabled: settings.tax_enabled,
    default_tax_rate: numberValue(settings.default_tax_rate),
    online_payment_enabled: settings.online_payment_enabled,
  })),
);
