import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateClientsTable1734041391000 implements MigrationInterface {
  name = 'CreateClientsTable1734041391000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable UUID extension if not already enabled
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying(100) NOT NULL,
        "email" character varying(255) NOT NULL,
        "cpf" character varying(11) NOT NULL,
        "phone" character varying(15) NOT NULL,
        "access_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_clients" PRIMARY KEY ("id")
      )
    `);

    // Create unique index on email (only for non-deleted records)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_clients_email_unique" 
      ON "clients" ("email") 
      WHERE "deleted_at" IS NULL
    `);

    // Create unique index on cpf (only for non-deleted records)
    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_clients_cpf_unique" 
      ON "clients" ("cpf") 
      WHERE "deleted_at" IS NULL
    `);

    // Create index on deleted_at for soft delete queries
    await queryRunner.query(`
      CREATE INDEX "IDX_clients_deleted_at" 
      ON "clients" ("deleted_at")
    `);

    // Create index on created_at for sorting
    await queryRunner.query(`
      CREATE INDEX "IDX_clients_created_at" 
      ON "clients" ("created_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_clients_created_at"`);
    await queryRunner.query(`DROP INDEX "IDX_clients_deleted_at"`);
    await queryRunner.query(`DROP INDEX "IDX_clients_cpf_unique"`);
    await queryRunner.query(`DROP INDEX "IDX_clients_email_unique"`);
    await queryRunner.query(`DROP TABLE "clients"`);
  }
}
