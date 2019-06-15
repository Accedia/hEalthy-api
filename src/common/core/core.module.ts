import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './../../app.service';
import { Module } from '@nestjs/common';
import { Substance } from './../../data/entities/substance';

@Module({
  imports: [TypeOrmModule.forFeature([Substance])],
  providers: [AppService],
  exports: [AppService],
})
export class CoreModule { }
