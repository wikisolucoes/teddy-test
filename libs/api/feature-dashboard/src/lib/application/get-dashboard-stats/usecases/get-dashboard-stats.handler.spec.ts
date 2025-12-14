import { Test, TestingModule } from '@nestjs/testing';
import { GetDashboardStatsHandler } from './get-dashboard-stats.handler.js';
import { GetDashboardStatsQuery } from '../queries/get-dashboard-stats.query.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';

class MockClientRepository {
  countActive = jest.fn();
  countDeleted = jest.fn();
  countNewThisMonth = jest.fn();
}

jest.mock('@teddy-monorepo/api/feature-clients');

describe('GetDashboardStatsHandler', () => {
  let handler: GetDashboardStatsHandler;
  let clientRepository: jest.Mocked<ClientRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDashboardStatsHandler,
        {
          provide: ClientRepository,
          useClass: MockClientRepository,
        },
      ],
    }).compile();

    handler = module.get<GetDashboardStatsHandler>(GetDashboardStatsHandler);
    clientRepository = module.get(ClientRepository);
  });

  it('should return dashboard stats successfully', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(50);
    clientRepository.countDeleted.mockResolvedValue(10);
    clientRepository.countNewThisMonth.mockResolvedValue(5);

    const result = await handler.execute(query);

    expect(result).toEqual({
      total: 60,
      active: 50,
      deleted: 10,
      newThisMonth: 5,
    });

    expect(clientRepository.countActive).toHaveBeenCalledTimes(1);
    expect(clientRepository.countDeleted).toHaveBeenCalledTimes(1);
    expect(clientRepository.countNewThisMonth).toHaveBeenCalledTimes(1);
  });

  it('should calculate total as sum of active and deleted', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(100);
    clientRepository.countDeleted.mockResolvedValue(25);
    clientRepository.countNewThisMonth.mockResolvedValue(15);

    const result = await handler.execute(query);

    expect(result.total).toBe(125);
  });

  it('should handle zero counts', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(0);
    clientRepository.countDeleted.mockResolvedValue(0);
    clientRepository.countNewThisMonth.mockResolvedValue(0);

    const result = await handler.execute(query);

    expect(result).toEqual({
      total: 0,
      active: 0,
      deleted: 0,
      newThisMonth: 0,
    });
  });

  it('should execute all counts in parallel', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(10);
    clientRepository.countDeleted.mockResolvedValue(5);
    clientRepository.countNewThisMonth.mockResolvedValue(2);

    await handler.execute(query);

    expect(clientRepository.countActive).toHaveBeenCalled();
    expect(clientRepository.countDeleted).toHaveBeenCalled();
    expect(clientRepository.countNewThisMonth).toHaveBeenCalled();
  });

  it('should return correct stats when no clients created this month', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(30);
    clientRepository.countDeleted.mockResolvedValue(5);
    clientRepository.countNewThisMonth.mockResolvedValue(0);

    const result = await handler.execute(query);

    expect(result.newThisMonth).toBe(0);
    expect(result.total).toBe(35);
  });

  it('should handle large numbers correctly', async () => {
    const query = new GetDashboardStatsQuery();

    clientRepository.countActive.mockResolvedValue(10000);
    clientRepository.countDeleted.mockResolvedValue(2000);
    clientRepository.countNewThisMonth.mockResolvedValue(500);

    const result = await handler.execute(query);

    expect(result).toEqual({
      total: 12000,
      active: 10000,
      deleted: 2000,
      newThisMonth: 500,
    });
  });
});
