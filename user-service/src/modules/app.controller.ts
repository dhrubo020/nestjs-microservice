import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

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
