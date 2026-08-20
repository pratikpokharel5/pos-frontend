export type UserRole = "admin" | "staff";

export type Status = "active" | "inactive";

export type User = {
  id: number;
  business_id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: Status;
  created_at?: string;
  updated_at?: string;
};

export type UserForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
};

export type UserPayload = {
  name: string;
  email?: string | null;
  phone: string;
  password?: string;
};

export type UserStatusPayload = {
  status: Status;
};

export const emptyUserForm: UserForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
};
