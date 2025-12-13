import { DEFAULT_LATEST_CLIENTS_LIMIT } from '../../shared/constants.js';

export class GetLatestClientsQuery {
  constructor(public readonly limit: number = DEFAULT_LATEST_CLIENTS_LIMIT) {}
}
