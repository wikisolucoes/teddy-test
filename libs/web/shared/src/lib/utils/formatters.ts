/**
 * Formatters - Funções utilitárias para formatação de dados
 * Seguindo padrões brasileiros (R$, datas, etc.)
 */

/**
 * Formata um valor numérico para moeda brasileira (R$ 0.000,00)
 * @param value - Valor numérico a ser formatado
 * @returns String formatada como moeda brasileira
 * @example formatCurrency(3500) // "R$ 3.500,00"
 * @example formatCurrency(120000) // "R$ 120.000,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Remove a formatação de moeda e retorna o valor numérico
 * @param value - String formatada como moeda (ex: "R$ 3.500,00")
 * @returns Valor numérico
 * @example unformatCurrency("R$ 3.500,00") // 3500
 * @example unformatCurrency("R$ 120.000,00") // 120000
 */
export function unformatCurrency(value: string): number {
  // Remove tudo exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,]/g, '');
  // Substitui vírgula por ponto para conversão
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
}

/**
 * Formata uma string de moeda durante a digitação
 * Aplica a máscara R$ 0.000,00 em tempo real
 * @param value - Valor digitado pelo usuário
 * @returns String formatada
 */
export function maskCurrency(value: string): string {
  // Remove tudo exceto dígitos
  const digits = value.replace(/\D/g, '');
  
  // Converte para número e divide por 100 (para ter centavos)
  const amount = parseInt(digits, 10) / 100;
  
  // Se não houver dígitos, retorna vazio
  if (isNaN(amount)) return '';
  
  // Formata usando a função de formatação
  return formatCurrency(amount);
}

/**
 * Formata uma data para o padrão brasileiro (dd/MM/yyyy)
 * @param date - String ISO ou objeto Date
 * @returns String formatada como dd/MM/yyyy
 * @example formatDate('2025-12-14T10:30:00Z') // "14/12/2025"
 * @example formatDate(new Date()) // "14/12/2025"
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(dateObj);
}

/**
 * Formata uma data com hora para o padrão brasileiro (dd/MM/yyyy HH:mm)
 * @param date - String ISO ou objeto Date
 * @returns String formatada como dd/MM/yyyy HH:mm
 * @example formatDateTime('2025-12-14T10:30:00Z') // "14/12/2025 10:30"
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Formata uma data de forma relativa (ex: "há 2 dias", "há 1 mês")
 * @param date - String ISO ou objeto Date
 * @returns String formatada de forma relativa
 * @example formatRelativeDate('2025-12-12T10:30:00Z') // "há 2 dias"
 */
export function formatRelativeDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'agora mesmo';
  if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} minutos`;
  if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} horas`;
  if (diffInSeconds < 2592000) return `há ${Math.floor(diffInSeconds / 86400)} dias`;
  if (diffInSeconds < 31536000) return `há ${Math.floor(diffInSeconds / 2592000)} meses`;
  return `há ${Math.floor(diffInSeconds / 31536000)} anos`;
}

/**
 * Formata um número para exibição (ex: 1000 -> "1.000")
 * @param value - Valor numérico
 * @returns String formatada
 * @example formatNumber(1000) // "1.000"
 * @example formatNumber(1000000) // "1.000.000"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value);
}
