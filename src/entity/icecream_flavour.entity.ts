import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { FlavourReaction } from './flavour_reaction.entity';
import { FlavourHashtag } from './flavour_hashtag.entity';

@Entity()
export class IcecreamFlavour {

  @PrimaryGeneratedColumn()
  icecream_flavour_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  name: string;

  @Column()
  composition: string;

  @Column()
  status: number;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.flavours, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

  @OneToMany(() => FlavourReaction, flavourReaction => flavourReaction.icecream_flavour, {eager: true})
  reactions: FlavourReaction[];

  @OneToMany(() => FlavourHashtag, flavourHashtag => flavourHashtag.icecream_flavour, {eager: true})
  hashtags: FlavourHashtag[];

}
