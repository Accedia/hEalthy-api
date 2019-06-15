import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { Substance } from './data/entities/substance';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CacheService {
    constructor(
        @InjectRepository(Substance)
        private readonly substanceRepository: Repository<Substance>,
      ) { }

    public Substances: SubstanceDTO[];

    public async LoadAllSubstances() {
        try {
            const substances: SubstanceDTO[] = (await this.substanceRepository.find({})).map((sub: Substance) => {
              const substanceDTO = new SubstanceDTO();
              substanceDTO.Description = sub.Description;
              return substanceDTO;
            });
            this.Substances = substances;
          } catch (error) {
      // tslint:disable-next-line: no-console
            console.log(error);
          }
    }
}
