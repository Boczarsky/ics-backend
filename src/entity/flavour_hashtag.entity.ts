import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamFlavour } from './icecream_flavour.entity';

@Entity()
export class FlavourHashtag {

  @PrimaryColumn()
  icecream_flavour_id: number;

  @PrimaryColumn()
  hashtag: string;

  @ManyToOne(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.hashtags)
  @JoinColumn({name: 'icecream_flavour_id'})
  icecream_flavour: IcecreamFlavour;

}
