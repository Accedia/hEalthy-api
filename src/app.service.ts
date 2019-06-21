import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CacheService } from './cache.service';
import { Study } from './data/entities/study';
import { StudyDTO } from './data/dto/study.dto';
import { HazardStatus } from './common/hazardStatus';
import { OverallStatus } from './common/overallStatus';
import { UtilsSevice } from './common/utils.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    private readonly cacheService: CacheService,
    private readonly utils: UtilsSevice,
  ) { }

  async findSubstanceByName(substance: string): Promise<SubstanceDTO[]> {
    const term = substance.toLowerCase().trim();
    const substances = this.cacheService.substances
      .filter(sb => sb.Name.toLowerCase().includes(term)
        || sb.Synonyms.some(syn => syn.toLowerCase().includes(term)));

    await this.includeStudies(substances);

    return Object.entries(this.utils.groupBy(substances, 'MasterExternalId'))
      .map(x => this.aggreagateSubstance(x));
  }

  async querySubstances(query: string): Promise<SubstanceDTO[]> {
    const ingredientNames = this.processQueryInputToIngredientNames(query);

    const matchedSubstances = [].concat.apply([], ingredientNames
      .map(q => this.cacheService.findSubstance(q)
      .concat(this.cacheService.findSubstancesBySynonym(q))))
      .filter(x => !!x);

    await this.includeStudies(matchedSubstances);

    const result = Object.entries(this.utils.groupBy(matchedSubstances, 'MasterExternalId'))
      .map(x => this.aggreagateSubstance(x));

    return result;
  }

  private processQueryInputToIngredientNames(query: string): string[] {
    query = query.replace(/\n/g, '');
    const match = this.utils.getRegexGroup(query, /Ingredients:\s*(.*?)\./gmi, 1);

    return match.split(/[,():]/).map(x => x.trim()).filter(x => !!x);
  }

  private aggreagateSubstance(substanceMap: any[]): SubstanceDTO {
    const riskiesStudy = this.determineRiskiestStudy((substanceMap[1] as SubstanceDTO[])
      .reduce((a, b) => a = a.concat(b.Studies), []));
    return {
      Id: substanceMap[1][0].Id,
      ExternalId: substanceMap[1][0].ExternalId,
      Name: substanceMap[1][0].Name,
      Description: substanceMap[1][0].Description,
      ExternalUrl: substanceMap[1][0].ExternalUrl,
      Synonyms: [...new Set((substanceMap[1] as SubstanceDTO[]).reduce((a, b) => a = a.concat(b.Synonyms), []))],
      Studies: riskiesStudy,
      Type: substanceMap[1][0].Type,
      OveralStatus: OverallStatus[this.determineOverallStatus(riskiesStudy[0])],
    } as SubstanceDTO;
  }

  private determineRiskiestStudy(studies: StudyDTO[]): StudyDTO[] {
    if (studies.length === 0) {
      return [];
    }

    const riskiest = studies
      .sort((a, b) => b.SafetyFactor - a.SafetyFactor)[0];

    return [riskiest];
  }

  private determineOverallStatus(study: StudyDTO): OverallStatus {
    if (!study) {
      return OverallStatus.Unknown;
    }

    if (study.SafetyFactor !== 0) {
      let status: OverallStatus;

      if (study.SafetyFactor < 3500) {
        status = OverallStatus.Safe;
      } else if (study.SafetyFactor >= 3500 && study.SafetyFactor < 6500) {
        status = OverallStatus.PossiblyDangerous;
      } else {
        status = OverallStatus.Dangerous;
      }

      return status;
    } else {
      let status: OverallStatus;

      if (study.IsCarcinogenic === 'Positive'
        || study.IsGenotoxic === 'Positive'
        || study.IsMutagenic === 'Positive') {
        status = OverallStatus.Dangerous;
      } else if (study.IsCarcinogenic === 'Ambiguous'
        || study.IsGenotoxic === 'Ambiguous'
        || study.IsMutagenic === 'Ambiguous') {
        status = OverallStatus.PossiblyDangerous;
      } else if (study.IsCarcinogenic === 'Negative'
        || study.IsGenotoxic === 'Negative'
        || study.IsMutagenic === 'Negative') {
        status = OverallStatus.Safe;
      }

      return status;
    }
  }

  private async includeStudies(substances: SubstanceDTO[]): Promise<void> {
    const substanceIds = substances.map(s => s.Id);

    const studies = substances.length > 0 ?
      this.utils.groupBy(await this.studyRepository.find({
        where: {
          SubstanceID: In(substanceIds),
        },
      }), 'SubstanceID') : [];

    substances.forEach(sub => sub.Studies = studies[sub.Id]
      ? studies[sub.Id].map(x => this.toDto(x))
      : []);
  }

  private toDto(study: Study): StudyDTO {
    return {
      Consumers: study.Consumers,
      ExternalUrl: study.ExternalUrl,
      Id: study.Id,
      IsCarcinogenic: HazardStatus[study.IsCarcinogenic],
      IsGenotoxic: HazardStatus[study.IsGenotoxic],
      IsMutagenic: HazardStatus[study.IsMutagenic],
      Remarks: study.Remarks,
      RiskInFullText: study.RiskInFullText,
      RiskUnit: study.RiskUnit,
      RiskValue: parseFloat(study.RiskValue.toString()),
      SafetyFactor: parseFloat(study.SafetyFactor.toString()),
      SubstanceClass: study.SubstanceClass,
      SubstanceID: study.SubstanceID,
    } as StudyDTO;
  }

  private evaluateEqualness(existingSubstance: string, querySubstance: string): boolean {
    const distance = this.utils.damerauLevenshteinDistance(existingSubstance, querySubstance);
    if (distance > querySubstance.length * 0.15) {
      return false;
    } else {
      return true;
    }
  }
}
