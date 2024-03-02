import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomInt, randomUUID } from 'crypto';
import { MicroServiceClient } from 'src/microservice';
import { newTracer } from 'src/tracer/tracer.utils';
import { WinstonLogger } from 'src/utils/logger';
import { trace, Span } from '@opentelemetry/api';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: MicroServiceClient,
    private winstonLogger: WinstonLogger,
  ) {}

  async getPosts(id: string) {
    const traceData = newTracer(this.getPosts.name);
    const tracer = trace.getTracer(this.getSlow.name);
    const userId = id || randomInt(5);
    const payload = {
      data: {
        userId,
      },
      spanContext: traceData.spanContext,
    };
    //
    console.log({ payload });

    // trace + logger
    const getFeedsSpan = tracer.startSpan('GET_FEEDS');
    this.winstonLogger.log(JSON.stringify(payload));
    const doc = await this.clientProxy.send('GET_FEEDS_MESSAGE', payload);
    if (!doc) {
      this.winstonLogger.error('Can not get posts', JSON.stringify(payload));
    }
    getFeedsSpan.end();
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
