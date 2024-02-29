import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { MicroServiceClient } from 'src/microservice';
import { newTracer } from 'src/tracer/tracer.utils';
import { WinstonLogger } from 'src/utils/logger';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: MicroServiceClient,
    private winstonLogger: WinstonLogger,
  ) {}

  async getHello() {
    const traceData = newTracer(this.getHello.name);
    const payload = {
      data: 'message from user service',
      spanContext: traceData.spanContext,
    };
    const doc = await this.clientProxy.send('test_message', payload);
    console.log({ doc });
    this.winstonLogger.log('Get Hellow');
    this.winstonLogger.error('Get Error', 'pppppp');
    traceData.span.end();

    return 'Hello World!';
  }

  async getSlow() {
    this.winstonLogger.error('Get Error', 'pppppp');
    const bucket = [50, 100, 500, 1000, 2000];
    const random = randomInt(5);
    if (random === 0) {
      this.winstonLogger.error('Error', 'trace');
      return new HttpException('Error', HttpStatus.CONFLICT);
    }
    console.log(bucket[random]);

    const doc = await new Promise((res, rej) => {
      setTimeout(() => {
        return res(`${Date.now()}: Res after ${bucket[random]} ms`);
      }, bucket[random]);
    });
    console.log(doc);
    this.winstonLogger.log('Get slow');
    return doc;
  }
}
