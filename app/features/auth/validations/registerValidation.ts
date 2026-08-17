import { object, pipe, string, trim, minLength } from "valibot";

export const registerFormSchema = pipe(
  object({
    business_name: pipe(string(), trim(), minLength(1, "Business name is required.")),
    owner_name: pipe(string(), trim(), minLength(1, "Owner name is required.")),
    phone: pipe(string(), trim(), minLength(1, "Phone is required.")),
    password: pipe(string(), trim(), minLength(8, "Password must be at least 8 characters.")),
  }),
);
