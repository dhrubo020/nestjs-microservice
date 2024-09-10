import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostAggEntity } from 'src/database/entities/agg.entity';
import { MicroServiceClient } from 'src/microservice';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    private clientProxy: MicroServiceClient,
    @InjectRepository(PostAggEntity)
    private ormRepository: Repository<PostAggEntity>,
  ) {}

  async getHello() {
    const doc = await this.clientProxy.send('task_message', {
      data: 'task msg',
    });
    console.log({ doc });
    return {
      userId: '11',
      content: 'Test post',
    };
  }
}
