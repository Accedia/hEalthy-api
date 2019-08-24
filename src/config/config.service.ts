import * as Joi from '@hapi/joi';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { DatabaseType } from 'typeorm';

export interface EnvConfig {
  [key: string]: string;
}

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(filePath?: string) {
    let config;
    const environment = process.env.NODE_ENV;
    if (environment === 'docker') {
      config = {
        NODE_ENV: process.env.NODE_ENV,
        JWT_SECRET: process.env.JWT_SECRET,
        DB_TYPE: process.env.DB_TYPE,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_DATABASE_NAME: process.env.DB_DATABASE_NAME,
        GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
      };
    } else {
      if (filePath !== undefined) {
        config = dotenv.parse(fs.readFileSync(filePath));
      } else {
        config = dotenv.config().parsed;
      }
    }
    this.envConfig = this.validateInput(config);
  }

  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid(['development', 'production', 'test', 'provision', 'docker'])
        .default('development'),
      PORT: Joi.number().default(3000),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRE: Joi.number().default(3600 * 24 * 7),
      DB_TYPE: Joi.string().default('mysql'),
      DB_HOST: Joi.string().default('localhost'),
      DB_PORT: Joi.number().default(3306),
      DB_USERNAME: Joi.string().default('root'),
      DB_PASSWORD: Joi.string().default('root'),
      DB_DATABASE_NAME: Joi.string().required(),
      GOOGLE_API_KEY: Joi.string().required(),
    });

    const { error, value: validatedEnvConfig } = Joi.validate(
      envConfig,
      envVarsSchema,
    );
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }

  public get port(): number {
    return +this.envConfig.PORT;
  }

  public get jwtSecret(): string {
    return this.envConfig.JWT_SECRET;
  }

  public get jwtExpireTime(): number {
    return +this.envConfig.JWT_EXPIRE;
  }

  public get dbHost(): string {
    return this.envConfig.DB_HOST;
  }

  public get dbPort(): number {
    return +this.envConfig.DB_PORT;
  }

  public get dbUsername(): string {
    return this.envConfig.DB_USERNAME;
  }

  public get dbPassword(): string {
    return this.envConfig.DB_PASSWORD;
  }

  public get dbName(): string {
    return this.envConfig.DB_DATABASE_NAME;
  }

  public get dbType(): DatabaseType {
    return this.envConfig.DB_TYPE as DatabaseType;
  }
}
