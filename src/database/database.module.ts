import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './../config/config.modeule';
import { ConfigService } from './../config/config.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: configService.dbType as any,
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: ['./src/data/entities/*.ts'],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule { }
