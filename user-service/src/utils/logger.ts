import { Global, Injectable, LoggerService, Module } from '@nestjs/common';
import * as winston from 'winston';
const LokiTransport = require('winston-loki');

@Injectable()
export class WinstonLogger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    try {
      console.log('Logger init...');
      const lokiTrans = new LokiTransport({
        label: {
          appName: 'user-service',
        },
        host: 'http://172.18.105.191:3100',
      });
      console.log(lokiTrans);

      this.logger = winston.createLogger({
        level: 'info',
        format: winston.format.json(),
        defaultMeta: { service: 'user-service' },
        transports: [lokiTrans],
      });
    } catch (error) {
      console.log(error);
    }
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
