import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostAggEntity } from 'src/database/entities/agg.entity';
import { PostModel } from 'src/database/entities/post.entity';
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
    return 'Hello World!';
  }

  async getPost() {
    // get post list
    const posts = await PostModel.find({}).lean();
    const userId = '1';

    // send from cache
    // send from db
    // save to mysql for users

    const aggPayload = {
      userId,
      content: 'aggregated content',
    };

    const aggData = this.ormRepository.create(aggPayload);
    const saveToMysql = await this.ormRepository.save(aggData);

    console.log({ saveToMysql });

    return posts;
  }
}
