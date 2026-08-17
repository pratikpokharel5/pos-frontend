import type { Category } from "~/features/categories/types";

export type Status = "active" | "inactive";

export type Product = {
  id: number;
  business_id: number;
  category_id: number;
  category?: Category;
  name: string;
  sku: string | null;
  price: string;
  description: string | null;
  status: Status;
};

export type ProductForm = {
  name: string;
  sku: string;
  category_id: string;
  price: string;
  description: string;
  status: Status;
};

export type ProductPayload = {
  category_id: number;
  name: string;
  sku?: string | null;
  price: string;
  description?: string | null;
  status?: Status;
};

export type ProductImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
};

export const emptyProductForm: ProductForm = {
  name: "",
  sku: "",
  category_id: "",
  price: "",
  description: "",
  status: "active",
};
