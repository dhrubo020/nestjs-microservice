import { Controller, Get } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RedisContext,
} from '@nestjs/microservices';
import { randomInt } from 'crypto';
import {
  trace,
  Span,
  propagation,
  context,
  createContextKey,
  SpanContext,
} from '@opentelemetry/api';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'test_message' })
  async getMessage(payload: { data: any; spanCtx: SpanContext }) {
    const { data } = payload;
    const parentSpanCtx = payload.spanCtx;
    console.log('parentSpanCtx', parentSpanCtx);
    const parentSpan = trace.setSpanContext(context.active(), parentSpanCtx);
    const span2 = trace
      .getTracer('user-serive')
      .startSpan('childspan', {}, parentSpan);
    console.log('MessagePattern', { data });
    await this.appService.getHello();
    span2.end();
    return 10;
  }
}
