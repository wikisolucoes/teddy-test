import { Alert, Button, Skeleton } from '@teddy-monorepo/web/shared';
import { Users, UserCheck, UserX, UserPlus, RefreshCw } from 'lucide-react';
import { Header } from '@teddy-monorepo/web/shared';
import { useAuth } from '@teddy-monorepo/web/feature-auth';
import { useDashboard } from '../../hooks/useDashboard';
import { StatsCard } from '../../components/cards/StatsCard';
import { LatestClientsTable } from '../../components/tables/LatestClientsTable';
import { ClientsChart } from '../../components/charts/ClientsChart';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { stats, latestClients, chartData, loading, error, refetch } =
    useDashboard();


  if (error && !loading) {
    return (
      <div className="min-h-screen bg-muted/30">
        <Header userName={user?.name} onLogout={logout} />
        <div className="container mx-auto p-6">
          <Alert variant="destructive" className="mb-6">
            <p className="font-semibold">Erro ao carregar dados do dashboard</p>
            <p className="text-sm mt-1">{error}</p>
          </Alert>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header userName={user?.name} onLogout={logout} />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Visão geral do sistema
            </p>
          </div>
          <Button
            onClick={refetch}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading || !stats ? (
            <>
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </>
          ) : (
            <>
              <StatsCard
                title="Total de Clientes"
                value={stats.total}
                icon={Users}
                color="blue"
              />
              <StatsCard
                title="Clientes Ativos"
                value={stats.active}
                icon={UserCheck}
                color="green"
              />
              <StatsCard
                title="Clientes Excluídos"
                value={stats.deleted}
                icon={UserX}
                color="red"
              />
              <StatsCard
                title="Novos este Mês"
                value={stats.newThisMonth}
                icon={UserPlus}
                color="orange"
              />
            </>
          )}
        </div>

        <LatestClientsTable clients={latestClients} loading={loading} />

        <ClientsChart data={chartData} loading={loading} />
      </div>
    </div>
  );
}
