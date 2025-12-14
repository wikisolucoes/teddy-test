/**
 * LatestClientsTable Component - Tabela dos últimos clientes cadastrados
 * Exibe uma tabela compacta com os dados dos últimos clientes
 */

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@teddy-monorepo/web/shared';
import { formatCurrency, formatDate } from '@teddy-monorepo/web/shared';
import type { LatestClientDto } from '../../../application/dtos/dashboard.dto';

interface LatestClientsTableProps {
  clients: LatestClientDto[];
  loading?: boolean;
}

/**
 * Tabela dos últimos clientes cadastrados
 */
export function LatestClientsTable({
  clients,
  loading = false,
}: LatestClientsTableProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">
            Nenhum cliente cadastrado ainda
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Clientes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold text-sm">Nome</th>
                <th className="pb-3 font-semibold text-sm">Salário</th>
                <th className="pb-3 font-semibold text-sm">Empresa</th>
                <th className="pb-3 font-semibold text-sm">Cadastro</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b last:border-0">
                  <td className="py-3 font-medium">{client.name}</td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {formatCurrency(client.salary)}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {formatCurrency(client.companyValuation)}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {formatDate(client.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
