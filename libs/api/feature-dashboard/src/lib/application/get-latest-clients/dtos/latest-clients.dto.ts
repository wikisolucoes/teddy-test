import { z } from 'zod';

export const ClientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  cpf: z.string(),
  phone: z.string(),
  accessCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LatestClientsSchema = z.object({
  clients: z.array(ClientSchema),
});

export type LatestClientsDto = z.infer<typeof LatestClientsSchema>;
