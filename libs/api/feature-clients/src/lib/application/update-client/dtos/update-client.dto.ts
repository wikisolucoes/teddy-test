import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UpdateClientSchema = z
  .object({
    name: z
      .string()
      .min(3)
      .max(100)
      .optional()
      .openapi({ example: 'João Silva Updated' }),
    email: z
      .string()
      .email()
      .optional()
      .openapi({ example: 'joao.updated@example.com' }),
    cpf: z
      .string()
      .regex(
        /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        'CPF must be in format XXX.XXX.XXX-XX or 11 digits'
      )
      .optional()
      .openapi({
        example: '987.654.321-00',
        description: 'CPF in format XXX.XXX.XXX-XX or 11 digits',
      }),
    phone: z
      .string()
      .regex(/^\+?\d{10,13}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Invalid phone format')
      .optional()
      .openapi({
        example: '(11) 91234-5678',
        description: 'Brazilian phone number',
      }),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided',
  })
  .openapi('UpdateClient');

export type UpdateClientDto = z.infer<typeof UpdateClientSchema>;
