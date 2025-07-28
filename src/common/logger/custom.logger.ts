import { LoggerService, LogLevel } from '@nestjs/common';
import chalk from 'chalk';
import { createLogger, format, Logger, transports } from 'winston';
import 'winston-daily-rotate-file';

export class CustomLogger implements LoggerService {
  private readonly logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.json(),
      ),
      transports: [
        // Console transport for development
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, context, stack }) => {
              const contextStr = context ? `[${chalk.yellow(context)}]` : '';
              const stackStr = stack ? `\n${chalk.red(stack)}` : '';
              return `[${chalk.green('Nest')}] - ${timestamp} ${level} ${contextStr} ${message}${stackStr}`;
            }),
          ),
        }),

        // Daily rotating file for all logs
        new transports.DailyRotateFile({
          filename: 'logs/application-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: format.combine(format.timestamp(), format.json()),
        }),

        // Separate error log file
        new transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '30d',
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),

        // Request/response logs
        new transports.DailyRotateFile({
          filename: 'logs/requests-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${level.toUpperCase()}] [${context || 'Request'}] ${message}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string, context: string) {
    this.logger.log('info', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'info',
    });
  }

  error(message: string, context: string, trace?: string) {
    this.logger.log('error', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'error',
      stack: trace,
    });
  }

  warn(message: string, context: string) {
    this.logger.log('warn', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'warn',
    });
  }

  debug?(message: string, context: string) {
    this.logger.log('debug', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'debug',
    });
  }

  verbose?(message: string, context: string) {
    this.logger.log('verbose', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'verbose',
    });
  }

  fatal?(message: string, context: string) {
    this.logger.log('fatal', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'fatal',
    });
  }

  setLogLevels?(levels: LogLevel[]) {}
}
