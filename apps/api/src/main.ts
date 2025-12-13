import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module.js';
import {
  AllExceptionsFilter,
  LoggingInterceptor,
} from '@teddy-monorepo/api/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get('winston');

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  app.useGlobalFilters(new AllExceptionsFilter(logger));

  app.useGlobalInterceptors(new LoggingInterceptor(logger));

  const config = new DocumentBuilder()
    .setTitle('Teddy API')
    .setDescription('API de gerenciamento de clientes')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e autorização')
    .addTag('clients', 'Gerenciamento de clientes')
    .addTag('dashboard', 'Estatísticas e métricas')
    .addTag('health', 'Health checks e métricas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(`📚 Swagger documentation: http://localhost:${port}/docs`);
  Logger.log(`🏥 Health check: http://localhost:${port}/${globalPrefix}/health`);
  Logger.log(`📊 Metrics: http://localhost:${port}/${globalPrefix}/metrics`);
}

bootstrap();
