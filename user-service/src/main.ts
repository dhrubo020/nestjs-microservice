import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { amqpUrl } from 'config';
import { AppModule } from './modules/app.module';
import { initTrace } from './tracer/tracer.config';
import { ResponseTimeMiddleware } from './utils/proms';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [amqpUrl],
      queue: 'user_queue',
      queueOptions: {
        durable: false,
      },
    },
  });
  await app.startAllMicroservices();
  initTrace('user-service');
  app.use(ResponseTimeMiddleware);
  const port = 3001;
  await app.listen(port);
  console.log(`user service: http://localhost:${port}`);
}
bootstrap();
