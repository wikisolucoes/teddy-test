import { z } from 'zod';

export const DashboardStatsSchema = z.object({
  total: z.number().int().nonnegative(),
  active: z.number().int().nonnegative(),
  deleted: z.number().int().nonnegative(),
  newThisMonth: z.number().int().nonnegative(),
});

export type DashboardStatsDto = z.infer<typeof DashboardStatsSchema>;
