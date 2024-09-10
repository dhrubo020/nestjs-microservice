import {
  Logger,
  Inject,
  HttpException,
  Global,
  Module,
  DynamicModule,
  HttpStatus,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, timeout } from 'rxjs';

export class MicroServiceClient {
  private logger = new Logger(MicroServiceClient.name, { timestamp: false });
  constructor(@Inject('MICROSERVICE_CLIENT') private client: ClientProxy) {}

  async send<T, U>(message: string, data: T): Promise<U> {
    console.log('Sending message...');
    try {
      return await firstValueFrom(
        this.client.send<U>({ cmd: message }, data).pipe(timeout(2000)),
      );
    } catch (error) {
      console.log(error);

      this.logger.error(
        `[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `,
        error.stack ?? new Error().stack,
      );
      //   throw new HttpException('Microservice Conn Error', 500);
    }
  }
}

const fact = () => {
  try {
    console.log('connecting to rmq');

    const px = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`${'amqp://localhost:5672'}`],
        queue: 'task_queue',
        queueOptions: {
          durable: false,
        },
      },
    });
    console.log(px);
    return px;
  } catch (error) {
    console.log(error);
    throw new HttpException('XXX', HttpStatus.CONFLICT);
  }
};

@Global()
@Module({})
export class MicroServiceClientModule {
  static register(url?: string): DynamicModule {
    return {
      module: MicroServiceClientModule,
      providers: [
        {
          provide: 'MICROSERVICE_CLIENT',
          useFactory: fact,
        },
        MicroServiceClient,
      ],
      exports: ['MICROSERVICE_CLIENT', MicroServiceClient],
    };
  }
}
