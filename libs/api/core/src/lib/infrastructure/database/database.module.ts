import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { writeDataSourceOptions, readDataSourceOptions } from './typeorm.config.js';

@Global()
@Module({
  imports: [
    // Conexão WRITE (padrão) - usada por Commands
    TypeOrmModule.forRoot({
      ...writeDataSourceOptions,
      name: 'default',
    }),
    
    // Conexão READ - usada por Queries
    TypeOrmModule.forRoot({
      ...readDataSourceOptions,
      name: 'read',
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
