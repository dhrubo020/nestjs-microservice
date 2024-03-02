import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.getHello();
  }

  @Get('/slow')
  async getSlow() {
    return await this.appService.getSlow();
  }

  @MessagePattern({ cmd: 'task_message' })
  message(data: any) {
    console.log('From task service', { data });
    return 11;
  }
}
