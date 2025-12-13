import { DEFAULT_CHART_MONTHS } from '../../shared/constants.js';

export class GetClientsChartDataQuery {
  constructor(public readonly months = DEFAULT_CHART_MONTHS) {}
}
