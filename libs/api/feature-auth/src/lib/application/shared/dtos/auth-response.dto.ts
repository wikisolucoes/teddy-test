import { z } from 'zod';

export const AuthResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.string(),
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
  }),
});

export type AuthResponseDto = z.infer<typeof AuthResponseSchema>;
