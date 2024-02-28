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

  @Get()
  async getHello() {
    await this.appService.getHello();
  }

  @MessagePattern({ cmd: 'task_message' })
  message(data: any) {
    console.log('From task service', { data });
    return 11;
  }
}
