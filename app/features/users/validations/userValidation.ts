import * as v from "valibot";

export const userFormSchema = v.object({
  name: v.pipe(v.string(), v.trim(), v.minLength(1, "Staff name is required.")),
  email: v.pipe(v.string(), v.trim(), v.minLength(1, "Email is required.")),
  password: v.pipe(
    v.string(),
    v.minLength(1, "Password is required."),
    v.minLength(8, "Password must be at least 8 characters."),
  ),
  status: v.picklist(["active", "inactive"]),
});
