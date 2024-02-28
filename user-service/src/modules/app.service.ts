import { Injectable } from '@nestjs/common';
import { MicroServiceClient } from 'src/microservice';

@Injectable()
export class AppService {
  constructor(private clientProxy: MicroServiceClient) {}

  async getHello() {
    const doc = await this.clientProxy.send('test_message', {
      data: 'test msg',
    });
    console.log({ doc });

    return 'Hello World!';
  }
}
