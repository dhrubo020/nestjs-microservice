import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { MicroServiceClient } from 'src/microservice';
import { newTracer } from 'src/tracer/tracer.utils';
import { WinstonLogger } from 'src/utils/logger';
import { trace, Span } from '@opentelemetry/api';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: MicroServiceClient,
    private winstonLogger: WinstonLogger,
  ) { }

  async getPosts() {
    const traceData = newTracer(this.getPosts.name);
    const tracer = trace.getTracer(this.getSlow.name);
    const payload = {
      data: 'message from user service',
      spanContext: traceData.spanContext,
    };
    //
    // trace + logger
    const getFeedsSpan = tracer.startSpan('GET-FEEDS');
    this.winstonLogger.log(JSON.stringify(payload));
    const doc = await this.clientProxy.send('GET_FEEDS_MESSAGE', payload);
    getFeedsSpan.end()
    //
    console.log({ doc });
    this.winstonLogger.log('Get Hellow');
    this.winstonLogger.error('Get Error', 'pppppp');
    traceData.span.end();

    return 'Hello World!';
  }

  async getSlow() {
    const traceData = newTracer(this.getSlow.name);
    const tracer = trace.getTracer(this.getSlow.name);

    this.winstonLogger.error('Get Error', 'pppppp');
    const bucket = [50, 100, 500, 1000, 2000];
    const random = randomInt(5);
    return tracer.startActiveSpan('parentDice', {}, async (parentSpan: Span) => {
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
    })


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
