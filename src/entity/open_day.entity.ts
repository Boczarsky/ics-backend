import { IcecreamShop } from './icecream-shop.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class OpenDay {

  @PrimaryGeneratedColumn()
  open_day_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  from: number;

  @Column()
  to: number;

  @Column()
  hour_from: string;

  @Column()
  hour_to: string;

  @ManyToOne(() => IcecreamShop, is => is.open_days)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
