import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity({
    name: 'UnknownSubstances',
})

export class UnknownSubstance {

    @PrimaryGeneratedColumn()
    public Id: number;

    @Column()
    public Name: string;
}
