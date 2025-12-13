import type { FindAllOptions } from '@teddy-monorepo/api/core';

export class ListClientsQuery {
  constructor(public readonly options: FindAllOptions) {}
}
