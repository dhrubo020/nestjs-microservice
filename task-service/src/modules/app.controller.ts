import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { newSpan } from 'src/tracer/tracer.utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  @MessagePattern({ cmd: 'GET_FEEDS_MESSAGE' })
  async getMessage(payload: any) {
    // const payload = {
    //   data: {
    //     userId: '',
    //   },
    //   spanContext: traceData.spanContext,
    // };
    const spanContext = payload?.spanContext;
    const childSpan = newSpan(this.getMessage.name, spanContext);
    console.log('MessagePattern', payload.data);
    // await this.appService.getHello();
    childSpan.end();
    return 10;
  }

  @Get()
  async message() {
    await this.redis.set('key', 'Redis data!');
    const redisData = await this.redis.get('key');
    console.log({ redisData });

    console.log('from task service');
    const post = await this.appService.getPost();
    return 10;
  }
}
