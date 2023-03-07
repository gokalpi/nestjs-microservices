import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CookieSessionModule } from 'nestjs-cookie-session';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().required(),
        SWAGGER_API_ROOT: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_AUTH_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/gateway/.env',
    }),
    CookieSessionModule.forRoot({
      session: { signed: false, secure: process.env.NODE_ENV !== 'test' },
    }),
    AuthModule,
  ],
})
export class GatewayModule {}
