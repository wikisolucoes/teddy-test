import { z } from 'zod';

export const ClientsChartDataSchema = z.object({
  labels: z.array(z.string()),
  data: z.array(z.number().int().nonnegative()),
});

export type ClientsChartDataDto = z.infer<typeof ClientsChartDataSchema>;
