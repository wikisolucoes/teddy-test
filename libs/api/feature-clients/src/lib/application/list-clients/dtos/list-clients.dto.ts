import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const ListClientsSchema = z
  .object({
    page: z
      .number()
      .int()
      .min(1)
      .default(1)
      .optional()
      .openapi({ example: 1, description: 'Page number' }),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .optional()
      .openapi({ example: 10, description: 'Items per page' }),
    search: z
      .string()
      .optional()
      .openapi({ example: 'João', description: 'Search by name, email or CPF' }),
    sortBy: z
      .enum(['name', 'email', 'createdAt', 'accessCount'])
      .default('createdAt')
      .optional()
      .openapi({ example: 'createdAt', description: 'Field to sort by' }),
    sortOrder: z
      .enum(['ASC', 'DESC'])
      .default('DESC')
      .optional()
      .openapi({ example: 'DESC', description: 'Sort order' }),
  })
  .openapi('ListClients');

export type ListClientsDto = z.infer<typeof ListClientsSchema>;
