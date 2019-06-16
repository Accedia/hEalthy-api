import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CacheService } from './cache.service';
import { Study } from 'dist/data/entities/study';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    private readonly cacheService: CacheService,
  ) { }

  async findSubstanceByName(substance: string): Promise<SubstanceDTO[]> {
    const term = substance.toLowerCase().trim();
    const substances = this.cacheService.Substances
      .filter(sb => sb.Name.toLowerCase().includes(term)
        || sb.Synonymes.some(syn => syn.toLowerCase().includes(term)));

    await this.includeStudies(substances);

    return Object.entries(this.groupBy(substances, 'MasterExternalId'))
      .map(x => this.aggreagateSubstance(x));
  }

  async querySubstances(query: string): Promise<SubstanceDTO[]> {
    const ingredientsString = 'ingredients: ';
    const startOfIngredients = query.indexOf(ingredientsString) + ingredientsString.length;
    const endOfIngredients =  query.substring(startOfIngredients).indexOf('.');
    const ingredients = query.slice(startOfIngredients, (endOfIngredients + ingredientsString.length));

    const ingredientNames = ingredients.toLowerCase().split(', ').map(x => x.trim());

    const matchedSubstances = this.cacheService.Substances
      .filter(substance => ingredientNames.includes(substance.Name.toLowerCase())
        || this.selectSynonyms(substance, ingredientNames));

    await this.includeStudies(matchedSubstances);

    return Object.entries(this.groupBy(matchedSubstances, 'MasterExternalId'))
      .map(x => this.aggreagateSubstance(x));
  }

  private aggreagateSubstance(substanceMap: any[]): SubstanceDTO {
    return {
      Id: substanceMap[1][0].Id,
      ExternalId: substanceMap[1][0].ExternalId,
      Name: substanceMap[1][0].Name,
      Description: substanceMap[1][0].Description,
      ExternalUrl: substanceMap[1][0].ExternalUrl,
      Synonymes: [...new Set((substanceMap[1] as SubstanceDTO[]).reduce((a, b) => a = a.concat(b.Synonymes), []))],
      Studies: (substanceMap[1] as SubstanceDTO[]).reduce((a, b) => a = a.concat(b.Studies), []),
    } as SubstanceDTO;
  }

  private async includeStudies(substances: SubstanceDTO[]): Promise<void> {
    const substanceIds = substances.map(s => s.Id);

    const studies = substances.length > 0 ?
      this.groupBy(await this.studyRepository.find({
        where: {
          SubstanceID: In(substanceIds),
        },
      }), 'SubstanceID') : [];

    substances.forEach(sub => sub.Studies = studies[sub.Id]
      ? studies[sub.Id]
      : []);
  }

  private groupBy(items: any[], key: string) {
    return items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );
  }

  private selectSynonyms(substance: SubstanceDTO, ingredientNames: string[]): boolean {
    return substance.Synonymes.map(syn => syn.toLowerCase()).some(v => ingredientNames.includes(v));
  }
}
