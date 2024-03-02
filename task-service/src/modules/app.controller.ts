import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { newSpan } from 'src/tracer/tracer.utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ cmd: 'GET_FEEDS_MESSAGE' })
  async getMessage(payload: any) {
    const spanContext = payload?.spanContext;
    const childSpan = newSpan(this.getMessage.name, spanContext);
    console.log('MessagePattern', payload.data);
    // await this.appService.getHello();
    childSpan.end();
    return 10;
  }
}
