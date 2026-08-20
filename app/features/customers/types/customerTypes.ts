export type Status = "active" | "inactive";

export type Customer = {
  id: number;
  business_id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: Status;
};

export type CustomerForm = {
  name: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
};

export type CustomerPayload = {
  name: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
};

export type CustomerStatusPayload = {
  status: Status;
};

export const emptyCustomerForm: CustomerForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  notes: "",
};
