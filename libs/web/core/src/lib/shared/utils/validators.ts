/**
 * Valida se um valor é um número válido e positivo
 */
export function validateCurrency(value: string | number): boolean {
  const numValue = typeof value === 'string' ? parseFloat(value.replace(/[^\d,.-]/g, '').replace(',', '.')) : value;
  return !isNaN(numValue) && numValue > 0;
}

/**
 * Valida formato de email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

