import { SubstanceType } from 'src/common/substanceType';

export class SubstanceDTO {
  public Id: number;
  public ExternalId: number;
  public Name: string;
  public Description: string;
  public Type: SubstanceType;
  public ExternalUrl: string;
  MasterExternalId: number;
}
