import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from 'typeorm';
import { SubstanceType } from 'src/common/substanceType';
import { type } from 'os';
import { Synonym } from './synonym';

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
    public ExternalUrl: string;

    @Column()
    public MasterExternalId: number;

    @OneToMany(type => Synonym, synonym => synonym.Substance)
    public Synonymes: Synonym[];
}
