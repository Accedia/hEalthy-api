import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './../../app.service';
import { Module } from '@nestjs/common';
import { Substance } from './../../data/entities/substance';
import { CacheService } from 'src/cache.service';

@Module({
  imports: [TypeOrmModule.forFeature([Substance])],
  providers: [AppService, CacheService],
  exports: [AppService, CacheService],
})
export class CoreModule { }
