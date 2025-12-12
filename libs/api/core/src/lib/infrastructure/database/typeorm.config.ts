import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

const baseConfig = {
  type: 'postgres' as const,
  entities: [join(__dirname, '../../../**/*.schema.{ts,js}')],
  migrations: [join(__dirname, './migrations/*.{ts,js}')],
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
