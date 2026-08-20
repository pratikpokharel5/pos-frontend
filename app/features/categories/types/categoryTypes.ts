export type Status = "active" | "inactive";

export type Category = {
  id: number;
  business_id: number;
  name: string;
  description: string | null;
  status: Status;
};

export type CategoryForm = {
  name: string;
  description: string;
  status: Status;
};

export type CategoryPayload = {
  name: string;
  description?: string | null;
  status?: Status;
};

export type CategoryImportResult = {
  created: number;
  updated: number;
  skipped: number;
  errors?: Array<{
    row: number;
    message: string;
  }>;
};

export const emptyCategoryForm: CategoryForm = {
  name: "",
  description: "",
  status: "active",
};
