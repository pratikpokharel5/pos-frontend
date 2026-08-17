import type { BusinessSettings } from "~/features/settings/types/settingsTypes";
import type { ProductLineForm } from "../types/saleFormTypes";

export function newProductLine() {
  return {
    id: randomReadableId("line-"),
    product_id: "",
    item_name: "",
    quantity: "1",
    unit_price: "",
    discount_amount: "0",
    notes: "",
  };
}

export function maxPercentValue(value: string) {
  if (value === "") {
    return value;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue <= 100) {
    return value;
  }

  return "100";
}

export function defaultTaxRate(settings: BusinessSettings | null) {
  return settings?.tax_enabled ? String(settings.default_tax_rate) : "0";
}

export function roundCurrency(value: number) {
  return Math.round(value * 100) / 100;
}

export function rawLineSubtotal(line: ProductLineForm) {
  return numberValue(line.quantity) * numberValue(line.unit_price);
}

export function lineTotal(line: ProductLineForm) {
  return Math.round(rawLineSubtotal(line));
}

export function lineDiscountAmount(line: ProductLineForm) {
  return Math.min(
    Math.round((rawLineSubtotal(line) * numberValue(line.discount_amount)) / 100),
    roundCurrency(rawLineSubtotal(line)),
  );
}

export function lineGrandTotal(line: ProductLineForm) {
  return Math.round(Math.max(rawLineSubtotal(line) - lineDiscountAmount(line), 0));
}

function backendLineTotal(line: ProductLineForm) {
  return roundCurrency(Math.max(rawLineSubtotal(line) - lineDiscountAmount(line), 0));
}

function saleDiscountAmount(subtotal: number, discountPercent: string) {
  return Math.round((subtotal * numberValue(discountPercent)) / 100);
}

export function calculateSaleTotals(
  lines: Array<ProductLineForm>,
  discountPercent: string,
  taxPercent: string,
) {
  const subtotal = roundCurrency(lines.reduce((sum, line) => sum + backendLineTotal(line), 0));
  const saleDiscount = Math.min(saleDiscountAmount(subtotal, discountPercent), subtotal);
  const taxable = subtotal - saleDiscount;
  const tax = roundCurrency(taxable * (numberValue(taxPercent) / 100));

  return {
    subtotal,
    saleDiscount,
    tax,
    grandTotal: roundCurrency(taxable + tax),
  };
}
