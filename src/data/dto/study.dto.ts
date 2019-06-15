import { HazardStatus } from 'src/common/hazardStatus';

export class StudyDTO {
  public Id: number;
  public SubstanceID: number;
  public SubstanceClass: string;
  public RiskValue: number;
  public RiskUnit: string;
  public RiskInFullText: string;
  public SafetyFactor: number;
  public Consumers: string;
  public IsMutagenic: HazardStatus;
  public IsGenotoxic: HazardStatus;
  public IsCarcinogenic: HazardStatus;
  public Remarks: string;
  public ExternalUrl: string;
}
