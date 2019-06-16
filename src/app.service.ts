import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Substance } from './data/entities/substance';
import { Repository, In } from 'typeorm';
import { CacheService } from './cache.service';
import { Study } from 'dist/data/entities/study';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Substance)
    private readonly substanceRepository: Repository<Substance>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
    private readonly cacheService: CacheService,
  ) { }

  async findAllSubstances(): Promise<SubstanceDTO[]> {
    try {
      const substances: SubstanceDTO[] = (await this.substanceRepository.find({})).map((sub: Substance) => {
        const substanceDTO = new SubstanceDTO();
        substanceDTO.Description = sub.Description;

        return substanceDTO;
      });
      substances.forEach(it => {
        console.log(it);
      });
      return substances;
    } catch (error) {
      console.log(error);
    }
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
    const substanceIds = matchedSubstances.map(s => s.Id);

    const studies = matchedSubstances.length > 0 ?
      this.groupBy(await this.studyRepository.find({
        where: {
          SubstanceID: In(substanceIds),
        },
      }), 'SubstanceID') : [];

    matchedSubstances.forEach(sub => sub.Studies = studies[sub.Id] ? studies[sub.Id] : []);

    return Object.entries(this.groupBy(matchedSubstances, 'MasterExternalId'))
      .map(x => (
      {
        Id: x[1][0].Id,
        ExternalId: x[1][0].ExternalId,
        Name: x[1][0].Name,
        Description: x[1][0].Description,
        ExternalUrl: x[1][0].ExternalUrl,
        Synonymes: (x[1] as SubstanceDTO[]).reduce((a, b) => a = a.concat(b.Synonymes), []),
        Studies: (x[1] as SubstanceDTO[]).reduce((a, b) => a = a.concat(b.Studies), []),
      } as SubstanceDTO));
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
    return substance.Synonymes.map(syn => syn.Name.toLowerCase()).some(v => ingredientNames.includes(v));
  }
}
