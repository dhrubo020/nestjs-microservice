import { InjectRedis } from '@nestjs-modules/ioredis';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import Redis from 'ioredis';
import { newSpan } from 'src/tracer/tracer.utils';
import { WinstonLogger } from 'src/utils/logger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private winstonLogger: WinstonLogger,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @MessagePattern({ cmd: 'test_message' })
  async getMessage(payload: any) {
    const spanContext = payload?.spanContext;
    const childSpan = newSpan(this.getMessage.name, spanContext);
    console.log({ childSpan });
    console.log('MessagePattern', payload.data);
    // await this.appService.getHello();
    // childSpan.end();
    // const childSpan2 = newSpan(this.getMessage.name, spanContext);
    // for (let i = 0; i < 1000; i++) {}
    // childSpan2.end();

    // const childSpan3 = newSpan(this.getMessage.name, spanContext);
    // for (let i = 0; i < 1000; i++) {}
    childSpan.end();
    return {
      userId: '11',
      content: 'Test post',
    };
  }

  @MessagePattern({ cmd: 'error_message' })
  async getError(payload: any) {
    const spanContext = payload?.spanContext;
    const childSpan = newSpan(this.getError.name, spanContext);

    try {
      throw Error('Custom Error');
    } catch (error) {
      childSpan.addEvent('error', {
        'error.message': ' error.message',
        'error.stack': 'error.stack',
      });
    }

    // await this.appService.getHello();
    childSpan.end();
    return null;
  }
}
