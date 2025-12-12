import { createLogger, format, transports, Logger } from 'winston';
import type { LoggerOptions } from 'winston';

export const winstonConfig: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  defaultMeta: {
    service: 'teddy-api',
    environment: process.env.NODE_ENV || 'development',
  },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ level, message, timestamp, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    }),
    
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    new transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
};

export const logger: Logger = createLogger(winstonConfig);

export const sanitizeForLog = (data: unknown): unknown => {
  if (!data || typeof data !== 'object') return data;
  
  const sensitive = ['password', 'token', 'authorization', 'jwt', 'secret'];
  const sanitized = { ...data } as Record<string, unknown>;
  
  for (const key in sanitized) {
    if (sensitive.some(s => key.toLowerCase().includes(s))) {
      sanitized[key] = '***REDACTED***';
    }
    
    // Sanitiza CPF parcialmente
    if (key.toLowerCase() === 'cpf' && typeof sanitized[key] === 'string') {
      const cpf = sanitized[key].replace(/\D/g, '');
      if (cpf.length === 11) {
        sanitized[key] = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-**`;
      }
    }
  }
  
  return sanitized;
};
