import { Injectable } from '@nestjs/common';
import { Span, trace } from '@opentelemetry/api';
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
    const traceData = newTracer('user-service');
    const payload = {
      data: 'message from user service',
      spanContext: traceData.spanContext,
    };
    const doc = await this.clientProxy.send('error_message', payload);
    // console.log({ doc });
    // this.winstonLogger.log('Get Hellow');
    // this.winstonLogger.error('Get Error', 'pppppp');

    traceData.span.end();
    if (!doc) {
      return 'Error';
    }

    return 'Hello World!';
  }

  async taskService() {
    const traceData = newTracer(this.getHello.name);
    const payload = {
      data: {
        userId: '',
      },
      spanContext: traceData.spanContext,
    };
    const doc = await this.clientProxy.send('test_message', payload);
    console.log({ doc });
    this.winstonLogger.log('Get Hellow');
    this.winstonLogger.error('Get Error', 'pppppp');

    traceData.span.end();
    if (!doc) {
      return 'Error';
    }

    return doc;
  }

  async getSlow() {
    const traceData = newTracer(this.getSlow.name);
    const tracer = trace.getTracer(this.getSlow.name);

    this.winstonLogger.error('Get Error', 'pppppp');
    const bucket = [50, 100, 500, 1000, 2000];
    const random = randomInt(5);
    return tracer.startActiveSpan(
      'parentDice',
      {},
      async (parentSpan: Span) => {
        const doc = await new Promise((res, rej) => {
          setTimeout(() => {
            return res(`${Date.now()}: Res after ${bucket[random]} ms`);
          }, bucket[random]);
        });
        tracer.startActiveSpan('childDice-1', {}, async (childSpan: Span) => {
          await new Promise((res, rej) => {
            setTimeout(() => {
              return res(`${Date.now()}: Res after ${bucket[random]} ms`);
            }, bucket[random]);
          });
          childSpan.end();
        });
        tracer.startActiveSpan('childDice-2', {}, async (childSpan: Span) => {
          await new Promise((res, rej) => {
            setTimeout(() => {
              return res(`${Date.now()}: Res after ${bucket[random]} ms`);
            }, bucket[random]);
          });
          childSpan.end();
        });
        parentSpan.end();
        return doc;
      },
    );

    // const doc = await new Promise((res, rej) => {
    //   setTimeout(() => {
    //     return res(`${Date.now()}: Res after ${bucket[random]} ms`);
    //   }, bucket[random]);
    // });
    // console.log(doc);
    // this.winstonLogger.log('Get slow');
    // return doc;
  }
}
