import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Substance } from './data/entities/substance';
import { Repository } from 'typeorm';
import { CacheService } from './cache.service';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Substance)
    private readonly substanceRepository: Repository<Substance>,
    private readonly cacheService: CacheService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async findAllSubstances(): Promise<SubstanceDTO[]> {
    try {
      const substances: SubstanceDTO[] = (await this.substanceRepository.find({})).map((sub: Substance) => {
        const substanceDTO = new SubstanceDTO();
        substanceDTO.Description = sub.Description;

        return substanceDTO;
      });
      substances.forEach(it => {
        // tslint:disable-next-line: no-console
        console.log(it);
      });
      return substances;
    } catch (error) {
// tslint:disable-next-line: no-console
      console.log(error);
    }
  }

  async querySubstances(query: string): Promise<SubstanceDTO[]> {
    const ingredientsString = 'ingredients: ';
    const startOfIngredients = query.indexOf(ingredientsString) + ingredientsString.length;
    const endOfIngredients =  query.substring(startOfIngredients).indexOf('.');
    const ingredients = query.slice(startOfIngredients, (endOfIngredients + ingredientsString.length));

    const ingredientNames = ingredients.toLowerCase().split(', ').map(x=>x.trim());

    const groupBy = (items, key) => items.reduce(
      (result, item) => ({
        ...result,
        [item[key]]: [
          ...(result[item[key]] || []),
          item,
        ],
      }),
      {},
    );

    const matchedSubstances = this.cacheService.Substances
    .filter(substance => ingredientNames.includes(substance.Name.toLowerCase()) || this.selectSynonyms(substance, ingredientNames));

    return groupBy(matchedSubstances, 'MasterExternalId');
  }

  private selectSynonyms(substance: SubstanceDTO, ingredientNames: string[]): boolean {
    return substance.Synonymes.map(syn => syn.Name.toLowerCase()).some(v => ingredientNames.includes(v));
  }
}
