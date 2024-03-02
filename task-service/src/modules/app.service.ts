import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostAggEntity } from 'src/database/entities/agg.entity';
import { AggModel, PostModel } from 'src/database/entities/post.entity';
import { MicroServiceClient } from 'src/microservice';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private clientProxy: MicroServiceClient) {}

  async getPost() {
    // get post list
    try {
      const posts = await PostModel.find({}).lean();
      return posts;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async saveAggData(userId, posts) {
    // save to mysql for users
    const aggPayload = {
      userId,
      content: 'aggregated content',
    };
    // const aggData = this.ormRepository.create(aggPayload);
    const saved = await AggModel.create(aggPayload);
    console.log({ saved });
    return saved;
  }
}
