import * as v from "valibot";
import { calculateSaleTotals, lineDiscountAmount, roundCurrency } from "../utils/saleUtils";

const customerModeSchema = v.picklist(["walk-in", "existing", "new"]);
const paymentMethodSchema = v.picklist(["cash", "online"]);

export const saleFormSchema = v.pipe(
  v.object({
    customerMode: customerModeSchema,
    customerId: v.string(),
    newCustomer: v.object({
      name: v.string(),
      phone: v.string(),
    }),
    productLines: v.array(
      v.object({
        id: v.string(),
        product_id: v.string(),
        item_name: v.string(),
        quantity: v.string(),
        unit_price: v.string(),
        discount_amount: v.string(),
        notes: v.string(),
      }),
    ),
    discount: v.string(),
    taxRate: v.string(),
    taxEnabled: v.boolean(),
    paymentMethod: paymentMethodSchema,
    provider: v.string(),
    reference: v.string(),
    notes: v.string(),
  }),
  v.rawCheck(({ dataset, addIssue }) => {
    if (!dataset.typed) {
      return;
    }

    const form = dataset.value;

    if (!form.productLines.length) {
      addIssue({ message: "Add at least one item before saving the sale." });
    }

    form.productLines.forEach((line, index) => {
      const lineLabel = `Item ${index + 1}`;

      if (!line.product_id && !line.item_name.trim()) {
        addIssue({ message: `${lineLabel}: Custom Item Name is required.` });
      }

      if (numberValue(line.quantity) <= 0) {
        addIssue({ message: `${lineLabel}: Qty must be greater than 0.` });
      }

      if (!line.product_id && line.unit_price.trim() === "") {
        addIssue({
          message: `${lineLabel}: Unit Price is required for custom items.`,
        });
      }

      if (numberValue(line.unit_price) < 0) {
        addIssue({ message: `${lineLabel}: Unit Price cannot be negative.` });
      }

      const lineDiscount = numberValue(line.discount_amount);

      if (lineDiscount < 0 || lineDiscount > 100) {
        addIssue({
          message: `${lineLabel}: Discount must be between 0 and 100%.`,
        });
      }
    });

    if (form.customerMode === "existing" && !form.customerId) {
      addIssue({
        message: "Customer is required for existing customer sales.",
      });
    }

    if (form.customerMode === "new" && !form.newCustomer.name.trim()) {
      addIssue({
        message: "Customer name is required for new customer sales.",
      });
    }

    if (form.customerMode === "new" && !form.newCustomer.phone.trim()) {
      addIssue({
        message: "Customer phone is required for new customer sales.",
      });
    }

    if (!form.paymentMethod) {
      addIssue({ message: "Payment method is required." });
    }

    const discount = numberValue(form.discount);
    const taxRate = numberValue(form.taxRate);

    if (discount < 0 || discount > 100) {
      addIssue({ message: "Sale Discount must be between 0 and 100%." });
    }

    if (taxRate < 0 || taxRate > 100) {
      addIssue({ message: "Tax Rate must be between 0 and 100%." });
    }
  }),
  v.transform((form) => {
    const totals = calculateSaleTotals(form.productLines, form.discount, form.taxRate);

    return {
      customer_id:
        form.customerMode === "existing" && form.customerId ? Number(form.customerId) : null,
      customer:
        form.customerMode === "new" && form.newCustomer.name.trim() && form.newCustomer.phone.trim()
          ? {
              name: form.newCustomer.name.trim(),
              phone: form.newCustomer.phone.trim(),
            }
          : null,
      discount_amount: String(totals.saleDiscount),
      tax_rate: form.taxEnabled ? form.taxRate.trim() : "0",
      notes: form.notes.trim() || null,
      items: form.productLines.map((line) => ({
        product_id: line.product_id ? Number(line.product_id) : null,
        item_name: line.item_name.trim() || null,
        quantity: line.quantity.trim(),
        unit_price: line.unit_price.trim() || null,
        discount_amount: String(lineDiscountAmount(line)),
        notes: line.notes.trim() || null,
      })),
      payments: [
        {
          method: form.paymentMethod,
          amount: String(roundCurrency(totals.grandTotal)),
          provider: form.provider.trim() || null,
          transaction_reference: form.reference.trim() || null,
        },
      ],
    };
  }),
);
