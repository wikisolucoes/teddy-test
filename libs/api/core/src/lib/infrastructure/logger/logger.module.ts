import { Module, Global } from '@nestjs/common';
import { logger } from './winston.config.js';

@Global()
@Module({
  providers: [
    {
      provide: 'winston',
      useValue: logger,
    },
  ],
  exports: ['winston'],
})
export class LoggerModule {}
