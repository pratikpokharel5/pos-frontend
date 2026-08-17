export type UserRole = "admin" | "staff";

export type Status = "active" | "inactive";

export type User = {
  id: number;
  business_id: number;
  name: string;
  email: string;
  role: UserRole;
  status: Status;
  created_at?: string;
  updated_at?: string;
};

export type UserForm = {
  name: string;
  email: string;
  password: string;
  status: Status;
};

export type UserPayload = {
  name: string;
  email: string;
  password?: string;
  status?: Status;
};

export const emptyUserForm: UserForm = {
  name: "",
  email: "",
  password: "",
  status: "active",
};
