import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetDashboardStatsQuery } from '../queries/get-dashboard-stats.query.js';
import type { DashboardStatsDto } from '../dtos/dashboard-stats.dto.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';

@QueryHandler(GetDashboardStatsQuery)
export class GetDashboardStatsHandler
  implements IQueryHandler<GetDashboardStatsQuery, DashboardStatsDto>
{
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(): Promise<DashboardStatsDto> {
    const [active, deleted, newThisMonth] = await Promise.all([
      this.clientRepository.countActive(),
      this.clientRepository.countDeleted(),
      this.clientRepository.countNewThisMonth(),
    ]);

    const total = active + deleted;

    return {
      total,
      active,
      deleted,
      newThisMonth,
    };
  }
}
