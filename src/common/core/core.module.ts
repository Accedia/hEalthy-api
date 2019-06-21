import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './../../app.service';
import { Module } from '@nestjs/common';
import { Substance } from './../../data/entities/substance';
import { CacheService } from 'src/cache.service';
import { Study } from 'src/data/entities/study';
import { UtilsSevice } from '../utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Substance, Study])],
  providers: [AppService, CacheService, UtilsSevice],
  exports: [AppService, CacheService],
})
export class CoreModule { }
