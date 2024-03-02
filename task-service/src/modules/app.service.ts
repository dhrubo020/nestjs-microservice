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
    const aggData = this.ormRepository.create(aggPayload);
    const saved = await this.ormRepository.save(aggData);
    console.log({ saved });
    return saved;
  }
}
