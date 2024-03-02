import { Global, Injectable, LoggerService, Module } from '@nestjs/common';
import { lokiHostUrl } from 'config';
import * as winston from 'winston';
const LokiTransport = require('winston-loki');

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'user-service-logger',
      format: winston.format.json(),
      defaultMeta: { service: 'user-service' },
      transports: [
        new LokiTransport({
          label: {
            appName: 'user-service',
          },
          host: lokiHostUrl,
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace: string) {
    this.logger.error(message, trace);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  verbose(message: string) {
    this.logger.verbose(message);
  }
}

@Global()
@Module({
  providers: [WinstonLogger],
  exports: [WinstonLogger],
})
export class LoggerModule {}
