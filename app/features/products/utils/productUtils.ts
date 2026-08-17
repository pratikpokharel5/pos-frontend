export function parseProductId(productId: string): number | null {
  const numberId = Number(productId);
  return Number.isInteger(numberId) && numberId > 0 ? numberId : null;
}
