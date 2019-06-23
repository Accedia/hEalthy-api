import { Controller, Get, Query, Body, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CacheService } from './cache.service';
import { ProcessSubstancesRequest } from './ProcessSubstancesRequest';
import { SubstanceDTO } from './data/dto/substance.dto';
import { ProcessImageRequest } from './ProcessImageRequest';

@Controller('healthy')
export class AppController {
  constructor(private readonly appService: AppService, private readonly cacheService: CacheService) {}

  @Get('substance')
  async getSubstanceInfo(@Query('name') substance: string): Promise<SubstanceDTO[]> {
    return this.appService.findSubstanceByName(substance);
  }

  @Get('load')
  async loadAllSubstancesInMemory(): Promise<any> {
    return await this.cacheService.loadAllSubstances();
  }

  @Post('process')
  async processSubstances(@Body() processSubstancesRequest: ProcessSubstancesRequest): Promise<SubstanceDTO[]> {
    return this.appService.querySubstances(processSubstancesRequest.query);
  }

  @Post('process/url')
  async processImageUrl(@Body() processImageRequest: ProcessImageRequest): Promise<SubstanceDTO[]> {
    const imageContent = await this.appService.readPicture(processImageRequest.url);
    return this.appService.querySubstances(imageContent);
  }
}
