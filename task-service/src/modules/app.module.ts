import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MicroServiceClientModule } from 'src/microservice';
import { LoggerModule } from 'src/utils/logger';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MicroServiceClientModule.register(),
    PrometheusModule.register(),
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
