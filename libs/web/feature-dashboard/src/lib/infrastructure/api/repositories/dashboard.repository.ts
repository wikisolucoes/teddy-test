/**
 * Dashboard Repository - Implementação da camada de infraestrutura
 * Integração com API usando apiClient
 */

import { apiClient } from '@teddy-monorepo/web/core';
import { API_ENDPOINTS } from '@teddy-monorepo/web/core';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
} from '../../application/dtos/dashboard.dto';

/**
 * Repositório para operações relacionadas ao dashboard
 */
export class DashboardRepository {
  /**
   * Busca estatísticas gerais do dashboard
   */
  async getStats(): Promise<DashboardStatsDto> {
    const response = await apiClient.get<DashboardStatsDto>(
      API_ENDPOINTS.DASHBOARD.STATS
    );
    return response.data;
  }

  /**
   * Busca os últimos clientes cadastrados
   * @param limit - Número máximo de clientes a retornar (padrão: 5)
   */
  async getLatestClients(limit: number = 5): Promise<LatestClientDto[]> {
    const response = await apiClient.get<LatestClientDto[]>(
      API_ENDPOINTS.DASHBOARD.LATEST,
      { params: { limit } }
    );
    return response.data;
  }

  /**
   * Busca dados do gráfico de clientes por mês
   */
  async getChartData(): Promise<ChartDataDto[]> {
    const response = await apiClient.get<ChartDataDto[]>(
      API_ENDPOINTS.DASHBOARD.CHART
    );
    return response.data;
  }
}

// Exporta uma instância singleton do repositório
export const dashboardRepository = new DashboardRepository();
