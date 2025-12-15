import { z } from 'zod';

/**
 * Valida se um valor de moeda é válido
 * @param value - String formatada como moeda (ex: "R$ 3.500,00")
 * @returns true se válido, false se inválido
 */
export function validateCurrency(value: string): boolean {
  const cleanValue = value.replace(/[^\d,]/g, '');
  
  if (!cleanValue) return false;
  
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

export const emailSchema = z
  .string()
  .min(1, 'Email é obrigatório')
  .email('Email inválido');

export const passwordSchema = z
  .string()
  .min(6, 'Senha deve ter no mínimo 6 caracteres');

export const currencySchema = z
  .number({ message: 'Valor deve ser um número' })
  .positive('Valor deve ser positivo')
  .finite('Valor deve ser finito');

export const nameSchema = z
  .string()
  .min(3, 'Nome deve ter no mínimo 3 caracteres')
  .max(100, 'Nome deve ter no máximo 100 caracteres')
  .trim();

export const cpfSchema = z
  .string()
  .min(1, 'CPF é obrigatório')
  .regex(
    /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    'CPF deve estar no formato XXX.XXX.XXX-XX'
  );

export const phoneSchema = z
  .string()
  .min(1, 'Telefone é obrigatório')
  .regex(
    /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
    'Telefone deve estar no formato (XX) XXXXX-XXXX'
  );

export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const clientFormSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  cpf: cpfSchema,
  phone: phoneSchema,
});

export type LoginFormData = z.infer<typeof loginFormSchema>;
export type ClientFormData = z.infer<typeof clientFormSchema>;
