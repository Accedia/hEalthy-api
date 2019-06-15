import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

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
}
