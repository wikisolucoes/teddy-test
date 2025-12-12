import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/entities/user.entity.js';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface.js';
import { UserSchema } from './user.schema.js';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly repository: Repository<UserSchema>
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { email } });
    return schema ? this.toDomain(schema) : null;
  }

  async findById(id: string): Promise<User | null> {
    const schema = await this.repository.findOne({ where: { id } });
    return schema ? this.toDomain(schema) : null;
  }

  async save(user: User): Promise<User> {
    const schema = await this.repository.save(user);
    return this.toDomain(schema);
  }

  async create(user: Partial<User>): Promise<User> {
    const schema = this.repository.create(user);
    const saved = await this.repository.save(schema);
    return this.toDomain(saved);
  }

  private toDomain(schema: UserSchema): User {
    return new User({
      id: schema.id,
      name: schema.name,
      email: schema.email,
      password: schema.password,
      isActive: schema.isActive,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
      deletedAt: schema.deletedAt,
    });
  }
}
