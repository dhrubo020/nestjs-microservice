import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroServiceClientModule } from 'src/microservice';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MicroServiceClientModule.register()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
