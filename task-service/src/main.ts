import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { amqpUrl } from 'config';
import { connectToDatabase } from './database/mongo/mongo.init';
import { AppModule } from './modules/app.module';
import { initTrace } from './tracer/tracer.config';

async function bootstrap() {
  await connectToDatabase(); // mongodb
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'task_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  initTrace('task-service');
  await app.listen(4000);
}
bootstrap();
