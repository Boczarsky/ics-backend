import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class Localization {

  @PrimaryGeneratedColumn()
  localization_id: number;

  @Column()
  icecream_shop_id: number;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @OneToOne(() => IcecreamShop, icecreamShop => icecreamShop.localization)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
