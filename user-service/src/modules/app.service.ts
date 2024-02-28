import { Injectable } from '@nestjs/common';
import { MicroServiceClient } from 'src/microservice';
import { newTracer } from 'src/tracer/tracer.utils';

@Injectable()
export class AppService {
  constructor(private clientProxy: MicroServiceClient) {}

  async getHello() {
    const traceData = newTracer(this.getHello.name);
    const payload = {
      data: 'message from user service',
      spanContext: traceData.spanContext,
    };
    const doc = await this.clientProxy.send('test_message', payload);
    console.log({ doc });
    traceData.span.end();

    return 'Hello World!';
  }
}
