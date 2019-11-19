import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Promotion } from './promotion.entity';
import { User } from './user.entity';

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

  @Column()
  status: number;

  @ManyToOne(() => Promotion, promotion => promotion.coupons)
  @JoinColumn({name: 'promotion_id'})
  promotion: Promotion;

  @ManyToOne(() => User, user => user.coupons)
  @JoinColumn({name: 'user_id'})
  user: User;

}
