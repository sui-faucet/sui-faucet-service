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
        format.colorize(),
        format.timestamp(),
        format.simple(),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ level, message, timestamp, context }) => {
              return `[${chalk.green('Nest')}] - ${timestamp} ${level} [${chalk.yellow(context)}] ${message}`;
            }),
          ),
        }),
        new transports.DailyRotateFile({
          filename: 'logs/%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
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

  error(message: string, context: string) {
    this.logger.log('error', message, {
      context,
      timestamp: new Date().toISOString(),
      level: 'error',
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
