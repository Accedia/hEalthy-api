import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { Substance } from './data/entities/substance';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SynonymDTO } from './data/dto/synonym.dto';
import { Synonym } from './data/entities/synonym';

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
              substanceDTO.Synonymes = this.toDTO(sub.Synonymes);
              return substanceDTO;
            });
            this.Substances = substances;
          } catch (error) {
      // tslint:disable-next-line: no-console
            console.log(error);
          }
    }

  private toDTO(synonymes: Synonym[]): SynonymDTO[] {
    let synonymesDto: SynonymDTO[] = [];
    if (synonymes !== undefined) {

      synonymesDto = synonymes.map(synonym => {
        const synonymDto = new SynonymDTO();
        synonymDto.Id = synonym.Id;
        synonymDto.Name = synonym.Name;
        synonymDto.SubstanceID = synonym.SubstanceID;
        return synonymDto;
      });
    }
    return synonymesDto;
  }
}
