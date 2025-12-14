import { Test, TestingModule } from '@nestjs/testing';
import { GetClientsChartDataHandler } from './get-clients-chart-data.handler.js';
import { GetClientsChartDataQuery } from '../queries/get-clients-chart-data.query.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';

class MockClientRepository {
  countClientsByMonth = jest.fn();
}

jest.mock('@teddy-monorepo/api/feature-clients');

describe('GetClientsChartDataHandler', () => {
  let handler: GetClientsChartDataHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetClientsChartDataHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<GetClientsChartDataHandler>(GetClientsChartDataHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should return chart data successfully', async () => {
    const query = new GetClientsChartDataQuery(3);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth() - 2, 1), count: 5 },
      { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: 10 },
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 15 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toEqual([5, 10, 15]);
    expect(result.labels).toHaveLength(3);
    expect(clientRepository.countClientsByMonth).toHaveBeenCalledWith(3);
  });

  it('should format labels in pt-BR format', async () => {
    const query = new GetClientsChartDataQuery(2);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: 8 },
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 12 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.labels).toHaveLength(2);
    expect(typeof result.labels[0]).toBe('string');
    expect(typeof result.labels[1]).toBe('string');
  });

  it('should respect the months parameter', async () => {
    const query = new GetClientsChartDataQuery(6);

    const monthsData = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(new Date().getFullYear(), new Date().getMonth() - (5 - i), 1),
      count: i + 1,
    }));

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    await handler.execute(query);

    expect(clientRepository.countClientsByMonth).toHaveBeenCalledWith(6);
  });

  it('should handle zero counts correctly', async () => {
    const query = new GetClientsChartDataQuery(3);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth() - 2, 1), count: 0 },
      { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: 0 },
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 0 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toEqual([0, 0, 0]);
  });

  it('should return correct number of data points', async () => {
    const query = new GetClientsChartDataQuery(12);

    const monthsData = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(new Date().getFullYear(), new Date().getMonth() - (11 - i), 1),
      count: i * 2,
    }));

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toHaveLength(12);
    expect(result.labels).toHaveLength(12);
  });

  it('should map month data to chart data correctly', async () => {
    const query = new GetClientsChartDataQuery(4);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth() - 3, 1), count: 1 },
      { month: new Date(now.getFullYear(), now.getMonth() - 2, 1), count: 2 },
      { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: 3 },
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 4 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toEqual([1, 2, 3, 4]);
    expect(result.labels).toHaveLength(4);
  });

  it('should handle single month request', async () => {
    const query = new GetClientsChartDataQuery(1);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 25 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toEqual([25]);
    expect(result.labels).toHaveLength(1);
  });

  it('should handle large count values', async () => {
    const query = new GetClientsChartDataQuery(3);

    const now = new Date();
    const monthsData = [
      { month: new Date(now.getFullYear(), now.getMonth() - 2, 1), count: 1000 },
      { month: new Date(now.getFullYear(), now.getMonth() - 1, 1), count: 2000 },
      { month: new Date(now.getFullYear(), now.getMonth(), 1), count: 3000 },
    ];

    clientRepository.countClientsByMonth.mockResolvedValue(monthsData);

    const result = await handler.execute(query);

    expect(result.data).toEqual([1000, 2000, 3000]);
  });
});
