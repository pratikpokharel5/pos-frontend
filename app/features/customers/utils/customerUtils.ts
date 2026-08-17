export function parseCustomerId(customerId: string): number | null {
  const numberId = Number(customerId);
  return Number.isInteger(numberId) && numberId > 0 ? numberId : null;
}
