import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, type FindOptionsWhere, type FindManyOptions } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity.js';
import { UserRepository } from '../../../../application/ports/user.repository.js';
import { UserSchema } from '../schemas/user.schema.js';

@Injectable()
export class TypeOrmUserRepository extends UserRepository {
  constructor(
    @InjectRepository(UserSchema, 'write')
    private readonly writeRepo: Repository<UserSchema>,
    @InjectRepository(UserSchema, 'read')
    private readonly readRepo: Repository<UserSchema>
  ) {
    super();
  }

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.readRepo.findOne({ where: { email } });
    return schema ? schema.mapToDomain() : null;
  }

  async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
    const schema = await this.readRepo.findOne({ where: where as FindOptionsWhere<UserSchema> });
    return schema ? schema.mapToDomain() : null;
  }

  async findMany(options?: FindManyOptions<User>): Promise<User[]> {
    const schemas = await this.readRepo.find(options as FindManyOptions<UserSchema>);
    return schemas.map((schema) => schema.mapToDomain());
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.readRepo.findOne({ where: { id } });
    return schema ? schema.mapToDomain() : null;
  }

  async save(user: User): Promise<User> {
    const schema = UserSchema.fromDomain(user);
    const saved = await this.writeRepo.save(schema);
    return saved.mapToDomain();
  }

  async delete(id: string): Promise<void> {
    await this.writeRepo.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.writeRepo.softDelete(id);
  }
}
