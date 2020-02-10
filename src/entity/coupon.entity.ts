import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { PromotionShop } from './promotion_shop.entity';

@Entity()
export class Coupon {

  @PrimaryGeneratedColumn()
  coupon_id: number;

  @Column()
  promotion_id: number;

  @Column()
  user_id: number;

  @Column()
  count: number;

  @ManyToOne(() => PromotionShop, promotionShop => promotionShop.coupons, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'promotion_id'})
  promotion_shop: PromotionShop;

  @ManyToOne(() => User, user => user.coupons, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

}
