import type { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1734000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Verificar se já existe usuário admin
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`,
      ['admin@teddy.com'],
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping seed...');
      return;
    }

    // Hash da senha 'admin123'
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Inserir usuário admin
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, is_active, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, now(), now())`,
      ['Administrador', 'admin@teddy.com', hashedPassword, true],
    );

    console.log('Admin user created successfully!');
    console.log('Email: admin@teddy.com');
    console.log('Password: admin123');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email = $1`,
      ['admin@teddy.com'],
    );
  }
}
