export class StudyDTO {
  public Id: number;
  public SubstanceID: number;
  public SubstanceClass: string;
  public RiskValue: number;
  public RiskUnit: string;
  public RiskInFullText: string;
  public SafetyFactor: number;
  public Consumers: string;
  public IsMutagenic: string;
  public IsGenotoxic: string;
  public IsCarcinogenic: string;
  public Remarks: string;
  public ExternalUrl: string;
}
