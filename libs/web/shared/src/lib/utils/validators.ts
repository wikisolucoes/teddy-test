/**
 * Validators - Funções utilitárias para validação de dados
 * Incluindo schemas Zod para uso com react-hook-form
 */

import { z } from 'zod';

/**
 * Valida se um valor de moeda é válido
 * @param value - String formatada como moeda (ex: "R$ 3.500,00")
 * @returns true se válido, false se inválido
 */
export function validateCurrency(value: string): boolean {
  // Remove tudo exceto números, vírgula e ponto
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  if (!cleanValue) return false;
  
  // Verifica se tem formato válido (números e opcionalmente vírgula)
  const pattern = /^\d+(?:,\d{1,2})?$/;
  return pattern.test(cleanValue);
}

/**
 * Valida se um email é válido (validação básica)
 * @param email - Email a ser validado
 * @returns true se válido, false se inválido
 */
export function validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

// ============================================
// SCHEMAS ZOD
// ============================================

/**
 * Schema Zod para validação de email
 */
export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido');

/**
 * Schema Zod para validação de senha
 */
export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres');

/**
 * Schema Zod para validação de valores monetários
 * Aceita números positivos
 */
export const currencySchema = z
  .number({ message: 'Valor deve ser um número' })
  .positive('Valor deve ser positivo')
  .finite('Valor deve ser finito');

/**
 * Schema Zod para validação de nome
 */
export const nameSchema = z
  .string()
  .min(3, 'Nome deve ter no mínimo 3 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .trim();

/**
 * Schema Zod para formulário de login
 */
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Schema Zod para formulário de cliente (criar/editar)
 * De acordo com o design-prompt.md, os campos são:
 * - Nome
 * - Salário
 * - Valor da empresa
 */
export const clientFormSchema = z.object({
  name: nameSchema,
  salary: currencySchema,
  companyValuation: currencySchema,
});

/**
 * Tipos inferidos dos schemas
 */
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;

/**
 * Helper para transformar string de moeda em número para validação
 * Usado em conjunto com react-hook-form para converter antes de validar
 */
export const currencyTransform = (value: string | number): number => {
  if (typeof value === 'number') return value;
  
  // Remove formatação e converte para número
  const cleanValue = value.replace(/[^\d,]/g, '');
  const normalizedValue = cleanValue.replace(',', '.');
  return parseFloat(normalizedValue) || 0;
};

/**
 * Schema com transformação para formulário de cliente
 * Usado quando os valores vêm como string formatada
 */
export const clientFormSchemaWithTransform = z.object({
  name: nameSchema,
  salary: z.preprocess(
    currencyTransform,
    currencySchema
  ),
  companyValuation: z.preprocess(
    currencyTransform,
    currencySchema
  ),
});
