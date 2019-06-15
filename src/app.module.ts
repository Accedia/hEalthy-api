import { Module, HttpModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.modeule';
import { DatabaseModule } from './database/database.module';
import { CoreModule } from './common/core/core.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    DatabaseModule,
    CoreModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
