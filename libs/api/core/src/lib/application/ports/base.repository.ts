import type { FindOptionsWhere, FindManyOptions } from 'typeorm';

export abstract class BaseRepository<T> {
  abstract findOne(where: FindOptionsWhere<T>): Promise<T | null>;
  abstract findMany(options?: FindManyOptions<T>): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<T>;
  abstract delete(id: string): Promise<void>;
  abstract softDelete(id: string): Promise<void>;
}
