import { z } from 'zod';

export const UpdateClientSchema = z
  .object({
    name: z.string().min(3).max(100).optional(),
    email: z.string().email().optional(),
    cpf: z
      .string()
      .regex(
        /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        'CPF must be in format XXX.XXX.XXX-XX or 11 digits'
      )
      .optional(),
    phone: z
      .string()
      .regex(/^\+?\d{10,13}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Invalid phone format')
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  });

export type UpdateClientDto = z.infer<typeof UpdateClientSchema>;
