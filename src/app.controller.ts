import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { ProcessSubstancesRequest } from './ProcessSubstancesRequest';
import { SubstanceDTO } from './data/dto/substance.dto';

@Controller('healthy')
export class AppController {
  constructor(private readonly appService: AppService, private readonly cacheService: CacheService) {}

  @Get('substance')
  async getSubstanceInfo(@Query('name') substance: string): Promise<SubstanceDTO[]> {
    return this.appService.findSubstanceByName(substance);
  }

  @Get('load')
  loadAllSubstancesInMemory() {
    this.cacheService.LoadAllSubstances();
  }

  @Post('process')
  async processSubstances(@Body() processSubstancesRequest: ProcessSubstancesRequest): Promise<SubstanceDTO[]> {
    return this.appService.querySubstances(processSubstancesRequest.query);
  }
}
