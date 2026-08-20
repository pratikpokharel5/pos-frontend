export function parseCustomerId(customerId: string) {
  const numberId = Number(customerId);

  return Number.isInteger(numberId) && numberId > 0 ? numberId : null;
}
