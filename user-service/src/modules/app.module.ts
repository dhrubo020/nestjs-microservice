import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServiceClientModule } from 'src/microservice';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // ClientsModule.register([
    //   {
    //     name: 'CLIENT_PROXY',
    //     transport: Transport.RMQ,
    //     options: {
    //       urls: ['amqp://localhost:5672'],
    //       queue: 'task_queue',
    //       queueOptions: {
    //         durable: false,
    //       },
    //     },
    //   },
    // ]),
    MicroServiceClientModule.register(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
