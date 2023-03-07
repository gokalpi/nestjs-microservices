import {
  MicroserviceExceptionsFilter,
  MicroserviceValidationPipe,
  RmqService,
} from '@app/common';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RmqOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions('AUTH'));

  app.useGlobalFilters(new MicroserviceExceptionsFilter());
  app.useGlobalPipes(new MicroserviceValidationPipe());

  await app.startAllMicroservices();

  Logger.log('Auth microservice started listening');
};

bootstrap();
