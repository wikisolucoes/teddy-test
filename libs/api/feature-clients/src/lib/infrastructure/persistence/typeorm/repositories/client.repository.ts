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

  async findByEmail(email: string, includeDeleted = false): Promise<Client | null> {
    if (includeDeleted) {
      const schema = await this.readRepo
        .createQueryBuilder('client')
        .withDeleted()
        .where('client.email = :email', { email })
        .getOne();
      return schema ? schema.mapToDomain() : null;
    }
    
    const schema = await this.readRepo.findOne({
      where: { email, deletedAt: IsNull() }
    });
    return schema ? schema.mapToDomain() : null;
  }

  async findByCpf(cpf: string, includeDeleted = false): Promise<Client | null> {
    if (includeDeleted) {
      const schema = await this.readRepo
        .createQueryBuilder('client')
        .withDeleted()
        .where('client.cpf = :cpf', { cpf })
        .getOne();
      return schema ? schema.mapToDomain() : null;
    }
    
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
      const sanitizedSearch = options.search.replace(/[%_]/g, '');
      qb.andWhere(
        '(client.name ILIKE :search OR client.email ILIKE :search)',
        { search: `%${sanitizedSearch}%` }
      );
    }

    const total = await qb.getCount();

    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'DESC';
    qb.orderBy(`client.${sortBy}`, sortOrder);

    const page = options.page || 1;
    const limit = Math.min(options.limit || 10, 100);
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

  async countActive(): Promise<number> {
    return this.readRepo.count({
      where: { deletedAt: IsNull() }
    });
  }

  async countDeleted(): Promise<number> {
    return this.readRepo
      .createQueryBuilder('client')
      .withDeleted()
      .where('client.deleted_at IS NOT NULL')
      .getCount();
  }

  async countNewThisMonth(): Promise<number> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return this.readRepo
      .createQueryBuilder('client')
      .where('client.deleted_at IS NULL')
      .andWhere('client.created_at >= :firstDay', { firstDay: firstDayOfMonth })
      .getCount();
  }

  async countClientsByMonth(months: number): Promise<Array<{ month: Date; count: number }>> {
    if (months < 1) {
      throw new Error('Months must be at least 1');
    }

    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const result = await this.readRepo
      .createQueryBuilder('client')
      .select("DATE_TRUNC('month', client.created_at)", 'month')
      .addSelect('COUNT(*)', 'count')
      .where('client.deleted_at IS NULL')
      .andWhere('client.created_at >= :startDate', { startDate })
      .groupBy("DATE_TRUNC('month', client.created_at)")
      .orderBy('month', 'ASC')
      .getRawMany();

    const monthsMap = new Map<string, number>();
    result.forEach((row) => {
      const monthKey = new Date(row.month).toISOString();
      monthsMap.set(monthKey, parseInt(row.count, 10));
    });

    const allMonths: Array<{ month: Date; count: number }> = [];
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toISOString();
      allMonths.push({
        month: date,
        count: monthsMap.get(monthKey) || 0,
      });
    }

    return allMonths;
  }
}
