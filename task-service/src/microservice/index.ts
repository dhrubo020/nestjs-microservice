import {
  Logger,
  Inject,
  HttpException,
  Global,
  Module,
  DynamicModule,
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
    try {
      console.log({ message, data });

      return await firstValueFrom(
        this.client.send<U>({ cmd: message }, data).pipe(timeout(2000)),
      );
    } catch (error) {
      this.logger.error(
        `[RPC_CALL_TIMEOUT] [MESSAGE] -> [${message}] `,
        error.stack ?? new Error().stack,
      );
      throw new HttpException('Microservice Conn Error', 500);
    }
  }
}

@Global()
@Module({})
export class MicroServiceClientModule {
  static register(url?: string): DynamicModule {
    return {
      module: MicroServiceClientModule,
      providers: [
        {
          provide: 'MICROSERVICE_CLIENT',
          useFactory: () =>
            ClientProxyFactory.create({
              transport: Transport.RMQ,
              options: {
                urls: ['amqp://localhost:5672'],
                queue: 'user_queue',
                queueOptions: {
                  durable: false,
                },
              },
            }),
        },
        MicroServiceClient,
      ],
      exports: ['MICROSERVICE_CLIENT', MicroServiceClient],
    };
  }
}
