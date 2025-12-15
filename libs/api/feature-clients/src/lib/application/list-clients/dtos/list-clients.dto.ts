import { z } from 'zod';

export const ListClientsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
  search: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'accessCount']).default('createdAt').optional(),
  sortOrder: z.enum(['ASC', 'DESC']).default('DESC').optional(),
});

export type ListClientsDto = z.infer<typeof ListClientsSchema>;
