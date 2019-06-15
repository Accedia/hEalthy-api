import { ConfigService } from './config/config.service';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  
  const options = new DocumentBuilder()
    .setTitle('Startup')
    .setDescription('Startup project with authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(app.get(ConfigService).port);
}
bootstrap();
