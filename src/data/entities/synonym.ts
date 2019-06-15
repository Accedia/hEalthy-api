import { Column, PrimaryGeneratedColumn, Entity, ManyToOne } from 'typeorm';
import { Substance } from './substance';

@Entity({
    name: 'Synonyms',
  })

export class Synonym {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public SubstanceID: number;

    @Column()
    public Name: string;

    @ManyToOne(type => Substance, substance => substance.Synonymes)
    public Substance: Substance;
}
