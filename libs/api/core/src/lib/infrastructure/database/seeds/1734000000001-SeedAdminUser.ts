import type { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class SeedAdminUser1734000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@teddy.com';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.SEED_ADMIN_NAME || 'Administrador';

    // Verificar se já existe usuário admin
    const existingAdmin = await queryRunner.query(
      `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [adminEmail],
    );

    if (existingAdmin.length > 0) {
      console.log('Admin user already exists, skipping seed...');
      return;
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // Inserir usuário admin
    await queryRunner.query(
      `INSERT INTO users (id, name, email, password, is_active, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, now(), now())`,
      [adminName, adminEmail, hashedPassword, true],
    );

    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@teddy.com';
    
    await queryRunner.query(
      `DELETE FROM users WHERE email = $1`,
      [adminEmail],
    );
  }
}
