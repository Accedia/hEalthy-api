import { ConfigService } from './config/config.service';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { join } from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(app.get(ConfigService).port);
}
bootstrap();
