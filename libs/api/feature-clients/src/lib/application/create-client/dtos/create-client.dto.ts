import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CreateClientSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(100, 'Name must be at most 100 characters')
      .openapi({ example: 'João Silva' }),
    email: z
      .string()
      .email('Invalid email format')
      .openapi({ example: 'joao.silva@example.com' }),
    cpf: z
      .string()
      .regex(
        /^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
        'CPF must be in format XXX.XXX.XXX-XX or 11 digits'
      )
      .openapi({
        example: '123.456.789-09',
        description: 'CPF in format XXX.XXX.XXX-XX or 11 digits',
      }),
    phone: z
      .string()
      .regex(/^\+?\d{10,13}$|^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Invalid phone format')
      .openapi({
        example: '(11) 98765-4321',
        description: 'Brazilian phone number',
      }),
  })
  .openapi('CreateClient');

export type CreateClientDto = z.infer<typeof CreateClientSchema>;
