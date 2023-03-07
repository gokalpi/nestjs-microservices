import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { GatewayModule } from './gateway.module';
import { MicroserviceValidationPipe, AllExceptionFilter } from '@app/common';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('Gateway');
  const app = await NestFactory.create(GatewayModule, { cors: true });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new MicroserviceValidationPipe());
  app.useGlobalFilters(new AllExceptionFilter());

  const configService = app.get(ConfigService);
  const swaggerApiRoot = configService.get<string>('SWAGGER_API_ROOT');

  const options = new DocumentBuilder()
    .setTitle('Ticketing Api Gateway')
    .setDescription('Tickets API gateway')
    .setVersion('1.0')
    .addTag('api-gateway')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(swaggerApiRoot, app, document);

  await app.listen(configService.get('PORT'));

  logger.log(`Gateway is listening on port: ${configService.get('PORT')}`);
}
bootstrap();
