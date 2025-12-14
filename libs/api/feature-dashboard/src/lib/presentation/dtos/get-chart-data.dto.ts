import { z } from 'zod';

export const GetChartDataSchema = z.object({
  months: z
    .number()
    .int('Months must be an integer')
    .min(1, 'Months must be at least 1')
    .max(24, 'Months must be at most 24')
    .optional(),
});

export type GetChartDataDto = z.infer<typeof GetChartDataSchema>;
