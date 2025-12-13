import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Client } from '../../../../domain/entities/client.entity.js';

@Entity('clients')
export class ClientSchema {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Index('idx_clients_email_unique', { unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Index('idx_clients_cpf_unique', { unique: true, where: 'deleted_at IS NULL' })
  @Column({ type: 'varchar', length: 11 })
  cpf!: string;

  @Column({ type: 'varchar', length: 15 })
  phone!: string;

  @Column({ type: 'integer', default: 0, name: 'access_count' })
  accessCount!: number;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;

  mapToDomain(): Client {
    return new Client(
      this.name,
      this.email,
      this.cpf,
      this.phone,
      this.accessCount,
      this.id,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    );
  }

  static fromDomain(client: Client): ClientSchema {
    const schema = new ClientSchema();
    schema.id = client.id;
    schema.name = client.name;
    schema.email = client.email;
    schema.cpf = client.cpf;
    schema.phone = client.phone;
    schema.accessCount = client.accessCount;
    schema.createdAt = client.createdAt;
    schema.updatedAt = client.updatedAt;
    schema.deletedAt = client.deletedAt;
    return schema;
  }
}
