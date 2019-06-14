import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';

@Controller('healthy')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthy')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('substance')
  getSubstanceInfo(@Query('substance') substance: string): string {     
    return substance;
  }
}
