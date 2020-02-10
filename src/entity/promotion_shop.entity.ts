import { Coupon } from './coupon.entity';
import { Promotion } from './promotion.entity';
import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class PromotionShop {

  @PrimaryColumn()
  promotion_id: number;

  @PrimaryColumn()
  icecream_shop_id: number;

  @ManyToOne(() => Promotion, promotion => promotion.assigned_shops, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'promotion_id'})
  promotion: Promotion;

  @ManyToOne(() => IcecreamShop, icecream_shop => icecream_shop.promotions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

  @OneToMany(() => Coupon, coupon => coupon.promotion_shop)
  coupons: Coupon[];
}
