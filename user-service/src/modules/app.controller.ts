import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async init() {
    return 'User service is running';
  }

  @Get('/posts/:id')
  async getHello(@Param('id') id: string) {
    return await this.appService.getPosts(id);
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
