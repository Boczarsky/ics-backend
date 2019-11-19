import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class Localization {

  @PrimaryColumn()
  icecream_shop_id: number;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @OneToOne(() => IcecreamShop, icecreamShop => icecreamShop.localization)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
