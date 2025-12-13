import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere, type FindManyOptions, IsNull } from 'typeorm';
import type { FindAllOptions, PaginatedResult } from '@teddy-monorepo/api/core';
import { Client } from '../../../../domain/entities/client.entity.js';
import { ClientRepository } from '../../../../application/ports/client.repository.js';
import { ClientSchema } from '../schemas/client.schema.js';

@Injectable()
export class TypeOrmClientRepository extends ClientRepository {
  constructor(
    @InjectRepository(ClientSchema, 'write')
    private readonly writeRepo: Repository<ClientSchema>,
    @InjectRepository(ClientSchema, 'read')
    private readonly readRepo: Repository<ClientSchema>
  ) {
    super();
  }

  async save(entity: Client): Promise<Client> {
    const schema = ClientSchema.fromDomain(entity);
    const saved = await this.writeRepo.save(schema);
    return saved.mapToDomain();
  }

  async softDelete(id: string): Promise<void> {
    await this.writeRepo.softDelete(id);
  }

  async delete(id: string): Promise<void> {
    await this.writeRepo.delete(id);
  }

  async incrementAccessCount(id: string): Promise<void> {
    await this.writeRepo.increment({ id }, 'accessCount', 1);
  }

  async findById(id: string): Promise<Client | null> {
    const schema = await this.readRepo.findOne({
      where: { id, deletedAt: IsNull() }
    });
    return schema ? schema.mapToDomain() : null;
  }

  async findOne(where: FindOptionsWhere<Client>): Promise<Client | null> {
    const schema = await this.readRepo.findOne({
      where: { ...where, deletedAt: IsNull() } as FindOptionsWhere<ClientSchema>
    });
    return schema ? schema.mapToDomain() : null;
  }

  async findMany(options?: FindManyOptions<Client>): Promise<Client[]> {
    const schemas = await this.readRepo.find({
      ...options,
      where: { ...options?.where, deletedAt: IsNull() } as FindOptionsWhere<ClientSchema>
    });
    return schemas.map(s => s.mapToDomain());
  }

  async findByEmail(email: string): Promise<Client | null> {
    const schema = await this.readRepo.findOne({
      where: { email, deletedAt: IsNull() }
    });
    return schema ? schema.mapToDomain() : null;
  }

  async findByCpf(cpf: string): Promise<Client | null> {
    const schema = await this.readRepo.findOne({
      where: { cpf, deletedAt: IsNull() }
    });
    return schema ? schema.mapToDomain() : null;
  }

  async findAll(options: FindAllOptions): Promise<PaginatedResult<Client>> {
    const qb = this.readRepo
      .createQueryBuilder('client')
      .where('client.deleted_at IS NULL');

    if (options.search) {
      qb.andWhere(
        '(client.name ILIKE :search OR client.email ILIKE :search)',
        { search: `%${options.search}%` }
      );
    }

    const total = await qb.getCount();

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'DESC';
    qb.orderBy(`client.${sortBy}`, sortOrder);

    const page = options.page || 1;
    const limit = options.limit || 10;
    qb.skip((page - 1) * limit).take(limit);

    const schemas = await qb.getMany();
    const items = schemas.map(s => s.mapToDomain());

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}
