import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  trace,
  Span,
  propagation,
  context,
  createContextKey,
} from '@opentelemetry/api';
import { GetTracer, ICreateTracerRes } from 'src/decorators/tracer.decorator';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('error')
  async getHello() {
    return await this.appService.getHello();
  }
  @Get('post')
  async success() {
    return await this.appService.taskService();
  }

  @Get('/data')
  async getSlow() {
    return await this.appService.getSlow();
  }

  // @MessagePattern({ cmd: 'task_message' })
  // message(data: any) {
  //   console.log('From task service', { data });
  //   return 11;
  // }
}
