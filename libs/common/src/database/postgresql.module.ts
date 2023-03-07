import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import DatabaseLogger from './database-logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        logger: new DatabaseLogger(),
        host: configService.get('POSTGRESQL_HOST') || 'localhost',
        port: configService.get('POSTGRESQL_PORT') || 5432,
        username: configService.get('POSTGRESQL_USERNAME'),
        password: configService.get('POSTGRESQL_PASSWORD'),
        database: configService.get('POSTGRESQL_DATABASE'),
        entities: [],
        synchronize: true,
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class PostgreSQLDbModule {}
