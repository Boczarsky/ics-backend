import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Coupon } from './coupon.entity';
import { IcecreamShop } from './icecream-shop.entity';
import { User } from './user.entity';
import { PromotionShop } from './promotion_shop.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn()
  promotion_id: number;

  @Column()
  user_id: number;

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

  @OneToMany(() => PromotionShop, promotionShop => promotionShop.promotion)
  assigned_shops: PromotionShop[];

  @ManyToOne(() => User, user => user.promotions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;
}
