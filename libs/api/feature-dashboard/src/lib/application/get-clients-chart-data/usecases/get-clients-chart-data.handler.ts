import { QueryHandler, type IQueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { GetClientsChartDataQuery } from '../queries/get-clients-chart-data.query.js';
import type { ClientsChartDataDto } from '../dtos/clients-chart-data.dto.js';
import { ClientRepository } from '@teddy-monorepo/api/feature-clients';

@QueryHandler(GetClientsChartDataQuery)
export class GetClientsChartDataHandler
  implements IQueryHandler<GetClientsChartDataQuery, ClientsChartDataDto>
{
  constructor(
    @Inject(ClientRepository)
    private readonly clientRepository: ClientRepository
  ) {}

  async execute(query: GetClientsChartDataQuery): Promise<ClientsChartDataDto> {
    const monthsData = await this.clientRepository.countClientsByMonth(query.months);

    return {
      labels: monthsData.map((m) =>
        m.month.toLocaleDateString('pt-BR', {
          month: 'short',
          year: 'numeric',
        })
      ),
      data: monthsData.map((m) => m.count),
    };
  }
}
