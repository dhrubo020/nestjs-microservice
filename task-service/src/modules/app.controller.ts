import { Controller, Get } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { newSpan } from 'src/tracer/tracer.utils';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { WinstonLogger } from 'src/utils/logger';

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
    childSpan.end();
    return 10;
  }

  @MessagePattern({ cmd: 'GET_FEEDS_MESSAGE' })
  async getPosts(payload: any) {
    console.log('message payload', { payload });

    const userId = payload?.data?.userId;
    const spanContext = payload?.spanContext;

    if (!userId || !spanContext) {
      this.winstonLogger.error('UserId or spanContext not found', '');
    }
    // caching
    const cacheSpan = newSpan(this.getMessage.name, spanContext);
    const cacheData = await this.redis.get(userId);
    if (cacheData) {
      return JSON.parse(cacheData);
    } else {
      console.log('cache missed');
      this.winstonLogger.log('Cache missed');
    }
    cacheSpan.end();

    // get post from mongodb
    const dbCallSpan = newSpan('dbCallSpan', spanContext);
    console.log('dbCallSpan', dbCallSpan.spanContext);

    const posts = await this.appService.getPost();
    dbCallSpan.end();

    // save agg data to mysql
    const saveAggSpan = newSpan('saveUserData', spanContext);
    const saveUserData = await this.appService.saveAggData(userId, posts);
    if (!saveUserData) {
      this.winstonLogger.error('Can not save agg data', userId);
    }
    saveAggSpan.end();
    await this.redis.set(userId, JSON.stringify(posts));

    // return posts
    console.log('sending posts');

    return posts;
  }

  @Get('get-feed/:id')
  async getFeed(payload: any) {
    console.log('message payload', { payload });

    const userId = payload?.data?.userId;
    const spanContext = payload?.spanContext;

    if (!userId || !spanContext) {
      this.winstonLogger.error('UserId or spanContext not found', '');
    }
    // caching
    const cacheSpan = newSpan(this.getMessage.name, spanContext);
    const cacheData = await this.redis.get(userId);
    if (cacheData) {
      return JSON.parse(cacheData);
    } else {
      console.log('cache missed');
      this.winstonLogger.log('Cache missed');
    }
    cacheSpan.end();

    // get post from mongodb
    const dbCallSpan = newSpan('dbCallSpan', spanContext);
    const posts = await this.appService.getPost();
    dbCallSpan.end();

    // save agg data to mysql
    const saveAggSpan = newSpan('saveUserData', spanContext);
    const saveUserData = await this.appService.saveAggData(userId, posts);
    if (!saveUserData) {
      this.winstonLogger.error('Can not save agg data', userId);
    }
    saveAggSpan.end();
    await this.redis.set(userId, JSON.stringify(posts));

    // return posts
    return posts;
  }

  @Get('agg')
  async message() {
    await this.redis.set('key', 'Redis data!');
    const redisData = await this.redis.get('key');
    console.log({ redisData });

    console.log('from task service');
    const post = await this.appService.getPost();
    return post;
  }
}
