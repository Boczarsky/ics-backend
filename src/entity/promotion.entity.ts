import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Coupon } from './coupon.entity';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  promotion_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  info: string;

  @Column()
  limit: number;

  @Column()
  prize: string;

  @Column()
  start_date: string;

  @Column()
  end_date: string;

  @OneToMany(() => Coupon, coupon => coupon.promotion)
  coupons: Coupon[];

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.promotions)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;
}
