export function getFormValidationErrors(issues: ReadonlyArray<{ message: string }>) {
  return issues.map((issue) => issue.message).join("\n");
}
