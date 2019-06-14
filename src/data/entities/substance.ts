import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity({
    name: 'Substances',
  })

export class Substance {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public ExternalId: number;

    @Column()
    public Name: string;

    @Column()
    public Description: string;

    @Column()
    public Type: SubstanceType;

    @Column()
    public ExternalUrl; string;
}
