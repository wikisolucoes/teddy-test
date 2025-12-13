import { DataSource, type DataSourceOptions } from 'typeorm';
import { CreateUsersTable1734000000000 } from './migrations/1734000000000-CreateUsersTable.js';
import { CreateClientsTable1734041391000 } from './migrations/1734041391000-CreateClientsTable.js';
import { SeedAdminUser1734000000001 } from './seeds/1734000000001-SeedAdminUser.js';

const baseConfig = {
  type: 'postgres' as const,
  entities: [],
  migrations: [
    CreateUsersTable1734000000000,
    CreateClientsTable1734041391000,
    SeedAdminUser1734000000001,
  ],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export const writeDataSourceOptions: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DB_WRITE_HOST || 'localhost',
  port: parseInt(process.env.DB_WRITE_PORT || '5432'),
  username: process.env.DB_WRITE_USERNAME || 'postgres',
  password: process.env.DB_WRITE_PASSWORD || 'postgres',
  database: process.env.DB_WRITE_DATABASE || 'teddy_db',
  synchronize: process.env.DB_WRITE_SYNC === 'true',
  logging: process.env.DB_WRITE_LOGGING === 'true',
};

export const readDataSourceOptions: DataSourceOptions = {
  ...baseConfig,
  host: process.env.DB_READ_HOST || 'localhost',
  port: parseInt(process.env.DB_READ_PORT || '5432'),
  username: process.env.DB_READ_USERNAME || 'postgres',
  password: process.env.DB_READ_PASSWORD || 'postgres',
  database: process.env.DB_READ_DATABASE || 'teddy_db',
  synchronize: process.env.DB_READ_SYNC === 'true',
  logging: process.env.DB_READ_LOGGING === 'true',
  poolSize: parseInt(process.env.DB_READ_POOL_SIZE || '20'),
};

export const AppDataSource = new DataSource(writeDataSourceOptions);
