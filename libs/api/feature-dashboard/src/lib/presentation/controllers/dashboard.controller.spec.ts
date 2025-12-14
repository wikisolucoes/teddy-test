import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from '../../application/services/dashboard.service.js';
import type { DashboardStatsDto } from '../../application/get-dashboard-stats/dtos/dashboard-stats.dto.js';
import type { LatestClientsDto } from '../../application/get-latest-clients/dtos/latest-clients.dto.js';
import type { ClientsChartDataDto } from '../../application/get-clients-chart-data/dtos/clients-chart-data.dto.js';

jest.mock('../../application/services/dashboard.service');

describe('DashboardController', () => {
  let controller: DashboardController;
  let dashboardService: jest.Mocked<DashboardService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [DashboardService],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
    dashboardService = module.get(DashboardService);
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      const expectedStats: DashboardStatsDto = {
        total: 150,
        active: 142,
        deleted: 8,
        newThisMonth: 23,
      };

      dashboardService.getStats.mockResolvedValue(expectedStats);

      const result = await controller.getStats();

      expect(result).toEqual(expectedStats);
      expect(dashboardService.getStats).toHaveBeenCalledTimes(1);
    });

    it('should call service without parameters', async () => {
      const expectedStats: DashboardStatsDto = {
        total: 50,
        active: 45,
        deleted: 5,
        newThisMonth: 10,
      };

      dashboardService.getStats.mockResolvedValue(expectedStats);

      await controller.getStats();

      expect(dashboardService.getStats).toHaveBeenCalledWith();
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Database error');
      dashboardService.getStats.mockRejectedValue(error);

      await expect(controller.getStats()).rejects.toThrow('Database error');
    });
  });

  describe('getLatest', () => {
    it('should return latest clients with default limit', async () => {
      const expectedResult: LatestClientsDto = {
        clients: [
          {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            cpf: '123.456.789-09',
            phone: '(11) 98765-4321',
            accessCount: 5,
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
          },
        ],
      };

      dashboardService.getLatestClients.mockResolvedValue(expectedResult);

      const result = await controller.getLatest({});

      expect(result).toEqual(expectedResult);
      expect(dashboardService.getLatestClients).toHaveBeenCalledWith(5);
    });

    it('should return latest clients with custom limit', async () => {
      const expectedResult: LatestClientsDto = {
        clients: [],
      };

      dashboardService.getLatestClients.mockResolvedValue(expectedResult);

      await controller.getLatest({ limit: 5 });

      expect(dashboardService.getLatestClients).toHaveBeenCalledWith(5);
    });

    it('should parse limit parameter correctly', async () => {
      const expectedResult: LatestClientsDto = {
        clients: [],
      };

      dashboardService.getLatestClients.mockResolvedValue(expectedResult);

      await controller.getLatest({ limit: 20 });

      expect(dashboardService.getLatestClients).toHaveBeenCalledWith(20);
    });

    it('should use default limit when limit is undefined', async () => {
      const expectedResult: LatestClientsDto = {
        clients: [],
      };

      dashboardService.getLatestClients.mockResolvedValue(expectedResult);

      await controller.getLatest({});

      expect(dashboardService.getLatestClients).toHaveBeenCalledWith(5);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Database error');
      dashboardService.getLatestClients.mockRejectedValue(error);

      await expect(controller.getLatest({ limit: 10 })).rejects.toThrow('Database error');
    });
  });  

  describe('getChartData', () => {
    it('should return chart data with default months', async () => {
      const expectedResult: ClientsChartDataDto = {
        labels: ['jul/2025', 'ago/2025', 'set/2025', 'out/2025', 'nov/2025', 'dez/2025'],
        data: [5, 12, 8, 15, 20, 23],
      };

      dashboardService.getChartData.mockResolvedValue(expectedResult);

      const result = await controller.getChartData({});

      expect(result).toEqual(expectedResult);
      expect(dashboardService.getChartData).toHaveBeenCalledWith(6);
    });

    it('should return chart data with custom months', async () => {
      const expectedResult: ClientsChartDataDto = {
        labels: ['nov/2025', 'dez/2025'],
        data: [20, 23],
      };

      dashboardService.getChartData.mockResolvedValue(expectedResult);

      await controller.getChartData({ months: 3 });

      expect(dashboardService.getChartData).toHaveBeenCalledWith(3);
    });

    it('should parse months parameter correctly', async () => {
      const expectedResult: ClientsChartDataDto = {
        labels: [],
        data: [],
      };

      dashboardService.getChartData.mockResolvedValue(expectedResult);

      await controller.getChartData({ months: 12 });

      expect(dashboardService.getChartData).toHaveBeenCalledWith(12);
    });

    it('should use default months when months is undefined', async () => {
      const expectedResult: ClientsChartDataDto = {
        labels: [],
        data: [],
      };

      dashboardService.getChartData.mockResolvedValue(expectedResult);

      await controller.getChartData({});

      expect(dashboardService.getChartData).toHaveBeenCalledWith(6);
    });

    it('should return data with correct structure', async () => {
      const expectedResult: ClientsChartDataDto = {
        labels: ['dez/2025'],
        data: [23],
      };

      dashboardService.getChartData.mockResolvedValue(expectedResult);

      const result = await controller.getChartData({ months: 1 });

      expect(result).toHaveProperty('labels');
      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.labels)).toBe(true);
      expect(Array.isArray(result.data)).toBe(true);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Database error');
      dashboardService.getChartData.mockRejectedValue(error);

      await expect(controller.getChartData({ months: 6 })).rejects.toThrow('Database error');
    });
  });
});
