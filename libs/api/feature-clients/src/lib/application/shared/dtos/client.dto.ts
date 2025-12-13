import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
  accessCount: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ClientListResponseSchema = z.object({
  data: z.array(ClientSchema),
  total: z.number().int(),
  page: z.number().int(),
  limit: z.number().int(),
  totalPages: z.number().int(),
});

export type ClientDto = z.infer<typeof ClientSchema>;
export type ClientListResponseDto = z.infer<typeof ClientListResponseSchema>;
