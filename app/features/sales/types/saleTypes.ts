import type { Customer, CustomerPayload } from "~/features/customers/types/customerTypes";
import type { Product } from "~/features/products/types/productTypes";

export type CustomerMode = "walk-in" | "existing" | "new";

export type PaymentMethod = "cash" | "online";

export type Payment = {
  id: number;
  business_id: number;
  sale_id: number;
  method: PaymentMethod;
  amount: string;
  provider: string | null;
  transaction_reference: string | null;
  notes: string | null;
};

export type SaleItem = {
  id: number;
  business_id: number;
  sale_id: number;
  product_id: number | null;
  product?: Product | null;
  item_name: string;
  quantity: string;
  unit_price: string;
  discount_amount: string;
  line_total: string;
  notes: string | null;
  additional_details: Record<string, unknown> | null;
};

export type Sale = {
  id: number;
  business_id: number;
  invoice_number: string;
  customer_id: number | null;
  customer?: Customer | null;
  status: "completed" | "held" | "voided" | "refunded";
  subtotal: string;
  discount_amount: string;
  tax_rate: string;
  tax_amount: string;
  grand_total: string;
  notes: string | null;
  additional_details: Record<string, unknown> | null;
  sold_at: string;
  items?: Array<SaleItem>;
  payments?: Array<Payment>;
};

export type SalePayload = {
  status?: "completed" | "held";
  customer_id?: number | null;
  customer?: CustomerPayload | null;
  discount_amount?: string;
  tax_rate?: string;
  notes?: string | null;
  additional_details?: Record<string, unknown> | null;
  items: Array<{
    product_id?: number | null;
    item_name?: string | null;
    quantity: string;
    unit_price?: string | null;
    discount_amount?: string;
    notes?: string | null;
    additional_details?: Record<string, unknown> | null;
  }>;
  payments: Array<{
    method: PaymentMethod;
    amount: string;
    provider?: string | null;
    transaction_reference?: string | null;
    notes?: string | null;
  }>;
};
