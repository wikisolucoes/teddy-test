import type { FindOptionsWhere, FindManyOptions } from 'typeorm';

export interface IBaseRepository<T> {
  findOne(where: FindOptionsWhere<T>): Promise<T | null>;
  findMany(options?: FindManyOptions<T>): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
  softDelete(id: string): Promise<void>;
}
