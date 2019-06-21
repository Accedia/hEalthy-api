import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { Substance } from './data/entities/substance';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubstanceType } from './common/substanceType';
import * as BKTree from 'mnemonist/bk-tree';
import { UtilsSevice } from './common/utils.service';
import { Synonym } from './data/entities/synonym';

@Injectable()
export class CacheService {

  private matchPercentage = 85;

  private synonymTree: any;
  private synonymMap: { [key: string]: Synonym } = {};

  private substanceTree: any;
  private substanceMap: { [key: string]: SubstanceDTO } = {};
  private substanceKeyMap: { [key: number]: SubstanceDTO } = {};

  public substances: SubstanceDTO[];

  constructor(
    @InjectRepository(Substance)
    private readonly substanceRepository: Repository<Substance>,
    private readonly utils: UtilsSevice,
  ) { }

  public async LoadAllSubstances() {
    try {
      const substances: SubstanceDTO[] =
        (await this.substanceRepository
          .find({ relations: ['Synonyms'] }))
          .map((sub: Substance) => {
            const substanceDTO = new SubstanceDTO();
            substanceDTO.Description = sub.Description;
            substanceDTO.Id = sub.Id;
            substanceDTO.ExternalId = sub.ExternalId;
            substanceDTO.ExternalUrl = sub.ExternalUrl;
            substanceDTO.MasterExternalId = sub.MasterExternalId;
            substanceDTO.Name = sub.Name;
            substanceDTO.Type = SubstanceType[sub.Type];
            substanceDTO.Synonyms = sub.Synonyms.map(s => s.Name);
            sub.Synonyms.forEach(syn => this.synonymMap[syn.Name.toLowerCase()] = syn);
            this.substanceMap[sub.Name.toLowerCase()] = substanceDTO;
            this.substanceKeyMap[sub.Id] = substanceDTO;
            return substanceDTO;
          });
      this.substances = substances;

      const allSynonyms = [...new Set([].concat.apply([], substances
        .map(s => s.Synonyms)))];
      this.synonymTree = (BKTree as any).from(allSynonyms, this.utils.damerauLevenshteinDistance);

      const allSubstances = [...new Set(this.substances.map(sub => sub.Name))];
      this.substanceTree = (BKTree as any).from(allSubstances, this.utils.damerauLevenshteinDistance);

      console.log('Data loaded successfully');
    } catch (error) {
      console.log(error);
    }
  }

  public findSubstancesBySynonym(query: string): SubstanceDTO[] {
    const maxDistance = query.length - Math.floor((this.matchPercentage / 100) * query.length);
    const findings = this.synonymTree.search(maxDistance, query.toLowerCase());

    const substanceIds = [...new Set(findings.map(f => this.synonymMap[f.item.toLowerCase()].SubstanceID))];
    return substanceIds.map((id: number) => this.substanceKeyMap[id]);
  }

  public findSubstance(query: string): SubstanceDTO[] {
    const maxDistance = query.length - Math.floor((this.matchPercentage / 100) * query.length);
    const findings = this.substanceTree.search(maxDistance, query.toLowerCase());

    return findings.map(f => this.substanceMap[f.item.toLowerCase()]);
  }
}
