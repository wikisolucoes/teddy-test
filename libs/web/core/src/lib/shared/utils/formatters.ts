/**
 * Formata um valor numérico como moeda brasileira (R$ 0.000,00)
 */
export function formatCurrency(value: number | string): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return 'R$ 0,00';
  }

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numValue);
}

/**
 * Remove formatação de moeda e retorna apenas o número
 */
export function unformatCurrency(value: string): number {
  // Remove tudo exceto números e vírgula/ponto
  const cleaned = value.replace(/[^\d,.-]/g, '');
  // Substitui vírgula por ponto
  const normalized = cleaned.replace(',', '.');
  const num = parseFloat(normalized);
  
  return isNaN(num) ? 0 : num;
}

/**
 * Formata uma data para formato brasileiro (DD/MM/YYYY)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

