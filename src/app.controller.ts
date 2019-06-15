import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('healthy')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthy')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('substance')
  getSubstanceInfo(@Query('substance') substance: string): string {

    this.appService.findAllSubstances();

    return substance;
  }
}
