import { Injectable } from '@nestjs/common';
import { SubstanceDTO } from './data/dto/substance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Substance } from './data/entities/substance';
import { Repository } from 'typeorm';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Substance)
    private readonly substanceRepository: Repository<Substance>,
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
}
