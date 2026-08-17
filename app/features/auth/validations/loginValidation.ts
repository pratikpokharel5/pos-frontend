import { object, pipe, string, trim, minLength } from "valibot";

export const loginFormSchema = object({
  email: pipe(string(), trim(), minLength(1, "Email or phone is required.")),
  password: pipe(string(), trim(), minLength(1, "Password is required.")),
});
