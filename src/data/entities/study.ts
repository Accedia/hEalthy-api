import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';
import { HazardStatus } from 'src/common/hazardStatus';

@Entity({
    name: 'Studies',
  })

export class Study {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public SubstanceID: number;

    @Column()
    public SubstanceClass: string;

    @Column()
    public RiskValue: number;

    @Column()
    public RiskUnit: string;

    @Column()
    public RiskInFullText: string;

    @Column()
    public SafetyFactor: number;

    @Column()
    public Consumers: string;

    @Column()
    public IsMutagenic: HazardStatus;

    @Column()
    public IsGenotoxic: HazardStatus;

    @Column()
    public IsCarcinogenic: HazardStatus;

    @Column()
    public Remarks: string;

    @Column()
    public ExternalUrl: string;
}
