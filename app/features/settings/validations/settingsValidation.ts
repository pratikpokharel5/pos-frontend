import * as v from "valibot";

export const settingsFormSchema = v.pipe(
  v.object({
    business_name: v.pipe(v.string(), v.trim(), v.minLength(1, "Business name is required.")),
    logo: v.pipe(v.string(), v.trim()),
    address: v.pipe(v.string(), v.trim()),
    phone: v.pipe(v.string(), v.trim(), v.minLength(1, "Phone is required.")),
    email: v.pipe(v.string(), v.trim()),
    tax_enabled: v.picklist(["yes", "no"]),
    default_tax_rate: v.pipe(v.string(), v.trim()),
    online_payment_enabled: v.picklist(["yes", "no"]),
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) {
      return;
    }

    const defaultTaxRateValue = dataset.value.default_tax_rate.trim();
    const defaultTaxRate = Number(defaultTaxRateValue || 0);

    if (!Number.isFinite(defaultTaxRate)) {
      addIssue({ message: "Default tax rate must be a valid number." });
      return;
    }

    if (!Number.isInteger(defaultTaxRate)) {
      addIssue({ message: "Default tax rate must be a whole number." });
      return;
    }

    if (defaultTaxRate < 0 || defaultTaxRate > 100) {
      addIssue({ message: "Default tax rate must be between 0 and 100%." });
    }
  }),
  v.transform((settings) => ({
    business_name: settings.business_name,
    logo: settings.logo || null,
    address: settings.address || null,
    phone: settings.phone,
    email: settings.email || null,
    tax_enabled: settings.tax_enabled === "yes",
    default_tax_rate: Math.round(numberValue(settings.default_tax_rate)),
    online_payment_enabled: settings.online_payment_enabled === "yes",
  })),
);
