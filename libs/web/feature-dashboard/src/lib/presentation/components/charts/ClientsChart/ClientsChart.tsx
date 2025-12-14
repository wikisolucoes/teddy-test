/**
 * ClientsChart Component - Gráfico de clientes por mês
 * Usa Recharts para criar gráfico de linha/área
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@teddy-monorepo/web/shared';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { ChartDataDto } from '../../../application/dtos/dashboard.dto';

interface ClientsChartProps {
  data: ChartDataDto[];
  loading?: boolean;
}

/**
 * Gráfico de evolução de clientes por mês
 */
export function ClientsChart({ data, loading = false }: ClientsChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Sem dados para exibir
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Evolução de Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
            />
            <Line
              type="monotone"
              dataKey="clients"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
