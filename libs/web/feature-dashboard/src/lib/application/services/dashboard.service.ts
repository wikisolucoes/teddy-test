/**
 * Dashboard Service - Camada de aplicação
 * Orquestra as operações do dashboard e pode aplicar regras de negócio
 */

import { dashboardRepository } from '../../infrastructure/api/repositories/dashboard.repository';
import type {
  DashboardStatsDto,
  LatestClientDto,
  ChartDataDto,
} from '../dtos/dashboard.dto';

/**
 * Serviço responsável por operações do dashboard
 */
export class DashboardService {
  /**
   * Busca todas as estatísticas do dashboard
   */
  async getStats(): Promise<DashboardStatsDto> {
    try {
      return await dashboardRepository.getStats();
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Busca os últimos clientes cadastrados
   */
  async getLatestClients(limit = 5): Promise<LatestClientDto[]> {
    try {
      return await dashboardRepository.getLatestClients(limit);
    } catch (error) {
      console.error('Error fetching latest clients:', error);
      throw error;
    }
  }

  /**
   * Busca dados do gráfico de clientes
   */
  async getChartData(): Promise<ChartDataDto[]> {
    try {
      return await dashboardRepository.getChartData();
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  }

  /**
   * Busca todos os dados do dashboard de uma vez
   * Útil para carregar tudo de uma vez na montagem da página
   */
  async getAllDashboardData() {
    try {
      const [stats, latestClients, chartData] = await Promise.all([
        this.getStats(),
        this.getLatestClients(),
        this.getChartData(),
      ]);

      return {
        stats,
        latestClients,
        chartData,
      };
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      throw error;
    }
  }
}

// Exporta uma instância singleton do serviço
export const dashboardService = new DashboardService();
