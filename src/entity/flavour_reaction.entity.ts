import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamFlavour } from './icecream_flavour.entity';

@Entity()
export class FlavourReaction {

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  icecream_flavour_id: number;

  @Column()
  reaction_type: number;

  @ManyToOne(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.reactions)
  @JoinColumn({name: 'icecream_flavour_id'})
  icecream_flavour: IcecreamFlavour;

}
