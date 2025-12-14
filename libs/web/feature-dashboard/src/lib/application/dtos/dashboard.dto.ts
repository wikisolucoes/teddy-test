/**
 * Dashboard DTOs - Data Transfer Objects para o Dashboard
 * Seguindo arquitetura DDD e separação de responsabilidades
 */

/**
 * DTO para estatísticas gerais do dashboard
 */
export interface DashboardStatsDto {
  total: number;
  active: number;
  deleted: number;
  newThisMonth: number;
}

/**
 * DTO para cliente na listagem de últimos clientes
 */
export interface LatestClientDto {
  id: string;
  name: string;
  salary: number;
  companyValuation: number;
  createdAt: string;
}

/**
 * DTO para dados do gráfico de clientes por mês
 */
export interface ChartDataDto {
  month: string;
  clients: number;
}

/**
 * DTO para resposta completa do dashboard
 * (Caso a API retorne tudo em um único endpoint)
 */
export interface DashboardDataDto {
  stats: DashboardStatsDto;
  latestClients: LatestClientDto[];
  chartData: ChartDataDto[];
}
