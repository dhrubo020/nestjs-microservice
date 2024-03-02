import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { MicroServiceClient } from 'src/microservice';
import { newSpan, newTracer } from 'src/tracer/tracer.utils';
import { WinstonLogger } from 'src/utils/logger';
import { trace, Span, context } from '@opentelemetry/api';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: MicroServiceClient,
    private winstonLogger: WinstonLogger,
  ) { }

  async getHello() {
    const traceData = newTracer(this.getHello.name);
    const payload = {
      data: 'message from user service',
      spanContext: traceData.spanContext,
    };
    //
    // trace + logger
    this.winstonLogger.log(JSON.stringify(payload));
    const doc = await this.clientProxy.send('test_message', payload);
    //
    console.log({ doc });
    this.winstonLogger.log('Get Hellow');
    this.winstonLogger.error('Get Error', 'pppppp');
    traceData.span.end();

    return 'Hello World!';
  }

  async getSlow() {
    const traceData = newTracer(this.getHello.name);
    const tracer = trace.getTracer(this.getSlow.name);

    this.winstonLogger.error('Get Error', 'pppppp');
    const bucket = [50, 100, 500, 1000, 2000];
    const random = randomInt(5);
    // const childSpan = newSpan('getslow-parent', traceData.spanContext);
    //   if (random === 0) {
    //     this.winstonLogger.error('Error', 'trace');
    //     return new HttpException('Error', HttpStatus.CONFLICT);
    //   }
    //   console.log(bucket[random]);

    return tracer.startActiveSpan('parentDice', {}, async (parentSpan: Span) => {
      const doc = await new Promise((res, rej) => {
        setTimeout(() => {
          return res(`${Date.now()}: Res after ${bucket[random]} ms`);
        }, bucket[random]);
      });
      tracer.startActiveSpan('childDice-1', {}, async (childSpan: Span) => {
        // if (random === 0) {
        //   this.winstonLogger.error('Error', 'trace');
        //   return new HttpException('Error', HttpStatus.CONFLICT);
        // }
        // console.log(bucket[random]);

        // this.winstonLogger.log('Get slow');
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
