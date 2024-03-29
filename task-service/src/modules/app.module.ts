import { RedisModule } from '@nestjs-modules/ioredis';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { redisUrl } from 'config';
import { PostAggEntity } from 'src/database/entities/agg.entity';
import { TypeOrmConfigModule } from 'src/database/ormConfig/typeOrm.config.module';
import { MicroServiceClientModule } from 'src/microservice';
import { LoggerModule } from 'src/utils/logger';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    RedisModule.forRoot({
      type: 'single',
      url: redisUrl,
    }),
    TypeOrmModule.forFeature([PostAggEntity]),
    TypeOrmConfigModule,
    MicroServiceClientModule.register(),
    PrometheusModule.register(),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
