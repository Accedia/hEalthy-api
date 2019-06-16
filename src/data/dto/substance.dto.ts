import { StudyDTO } from './study.dto';
import { OverallStatus } from 'src/common/overallStatus';

export class SubstanceDTO {
  public Id: number;
  public ExternalId: number;
  public Name: string;
  public Description: string;
  public Type: string;
  public ExternalUrl: string;
  public MasterExternalId: number;
  public Synonyms: string[];
  public Studies: StudyDTO[];
  public OveralStatus: string;
}
