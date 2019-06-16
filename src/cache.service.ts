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
            const substances: SubstanceDTO[] = (await this.substanceRepository.find({relations: ['Synonymes']})).map((sub: Substance) => {
              const substanceDTO = new SubstanceDTO();
              substanceDTO.Description = sub.Description;
              substanceDTO.Id = sub.Id;
              substanceDTO.ExternalId = sub.ExternalId;
              substanceDTO.ExternalUrl = sub.ExternalUrl;
              substanceDTO.MasterExternalId = sub.MasterExternalId;
              substanceDTO.Name = sub.Name;
              substanceDTO.Type = sub.Type;
              substanceDTO.Synonymes = sub.Synonymes.map(s => s.Name);
              return substanceDTO;
            });
            this.Substances = substances;
            console.log('Data loaded successfully');
          } catch (error) {
            console.log(error);
          }
    }
}
