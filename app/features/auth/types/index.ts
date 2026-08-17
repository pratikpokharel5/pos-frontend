export type UserRole = "admin" | "staff";

export type UserStatus = "active" | "inactive";

export type AuthUserResponse = {
  user: AuthUser;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  business: AuthBusiness;
};

export type AuthBusiness = {
  id: number;
  name: string;
  slug: string;
  status: UserStatus;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
  token: string;
};

export type RegisterForm = {
  business_name: string;
  owner_name: string;
  phone: string;
  password: string;
};

export type RegisterPayload = RegisterForm;
