import { IcecreamShop } from './icecream-shop.entity';
import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SpecialDay {

  @PrimaryGeneratedColumn()
  open_day_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  closed: number;

  @Column()
  from: string;

  @Column({nullable: true})
  to: string;

  @Column({nullable: true})
  hour_from: string;

  @Column({nullable: true})
  hour_to: string;

  @ManyToOne(() => IcecreamShop, is => is.open_days)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
