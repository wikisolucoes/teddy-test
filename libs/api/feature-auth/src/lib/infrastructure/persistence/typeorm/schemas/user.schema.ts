import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../../../domain/entities/user.entity.js';

@Entity('users')
export class UserSchema {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 255 })
  password!: string;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  mapToDomain(): User {
    return new User(
      this.name,
      this.email,
      this.password,
      this.isActive,
      this.id,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    );
  }

  static fromDomain(user: User): UserSchema {
    const schema = new UserSchema();
    schema.id = user.id;
    schema.name = user.name;
    schema.email = user.email;
    schema.password = user.password;
    schema.isActive = user.isActive;
    schema.createdAt = user.createdAt;
    schema.updatedAt = user.updatedAt;
    schema.deletedAt = user.deletedAt;
    return schema;
  }
}
