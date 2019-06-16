import { SubstanceType } from 'src/common/substanceType';
import { StudyDTO } from './study.dto';

export class SubstanceDTO {
  public Id: number;
  public ExternalId: number;
  public Name: string;
  public Description: string;
  public Type: string;
  public ExternalUrl: string;
  public MasterExternalId: number;
  public Synonymes: string[];
  public Studies: StudyDTO[];
}
