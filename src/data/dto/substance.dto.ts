import { SubstanceType } from 'src/common/substanceType';
import { SynonymDTO } from './synonym.dto';
import { StudyDTO } from './study.dto';

export class SubstanceDTO {
  public Id: number;
  public ExternalId: number;
  public Name: string;
  public Description: string;
  public Type: SubstanceType;
  public ExternalUrl: string;
  public MasterExternalId: number;
  public Synonymes: SynonymDTO[];
  public Studies: StudyDTO[];
}
