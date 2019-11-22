import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamFlavour } from './icecream_flavour.entity';

@Entity()
export class FlavourHashtag {

  @PrimaryColumn()
  hashtag: string;

  @PrimaryColumn()
  icecream_flavour_id: number;

  @ManyToOne(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.hashtags)
  @JoinColumn({name: 'icecream_flavour_id'})
  icecream_flavour: IcecreamFlavour;

}
