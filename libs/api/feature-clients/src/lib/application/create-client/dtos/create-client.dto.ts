import { z } from 'zod';

export const CreateClientSchema = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be at most 100 characters')
    .regex(
      /^[a-zA-ZÀ-ÿ\s'-]+$/,
      'Name must contain only letters, spaces, hyphens and apostrophes'
    ),
  email: z.string().email('Invalid email format'),
  cpf: z
    .string()
    .regex(
      /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'CPF must be in format XXX.XXX.XXX-XX or 11 digits'
    ),
  phone: z
    .string()
    .regex(/^\+?\d{10,13}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Invalid phone format'),
});

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
