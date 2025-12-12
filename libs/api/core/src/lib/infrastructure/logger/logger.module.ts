import { Module, Global } from '@nestjs/common';
import { logger } from './winston.config.js';

@Global()
@Module({
  providers: [
    {
      provide: 'LOGGER',
      useValue: logger,
    },
  ],
  exports: ['LOGGER'],
})
export class LoggerModule {}
