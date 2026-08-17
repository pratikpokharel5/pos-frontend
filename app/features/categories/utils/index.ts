export function parseCategoryId(categoryId: string | undefined) {
  if (!categoryId) {
    return null;
  }

  const numberId = Number(categoryId);

  return Number.isInteger(numberId) && numberId > 0 ? numberId : null;
}
