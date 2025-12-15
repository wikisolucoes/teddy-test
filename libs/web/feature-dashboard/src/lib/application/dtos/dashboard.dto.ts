export interface DashboardStatsDto {
  total: number;
  active: number;
  deleted: number;
  newThisMonth: number;
}

export interface LatestClientDto {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  createdAt: string;
}

export interface ChartDataDto {
  month: string;
  clients: number;
}

export interface DashboardDataDto {
  stats: DashboardStatsDto;
  latestClients: LatestClientDto[];
  chartData: ChartDataDto[];
}
