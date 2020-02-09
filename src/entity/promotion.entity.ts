import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToOne } from 'typeorm';
import { Coupon } from './coupon.entity';
import { IcecreamShop } from './icecream-shop.entity';
import { User } from './user.entity';

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

  @OneToMany(() => Coupon, coupon => coupon.promotion)
  coupons: Coupon[];

  @ManyToOne(() => User, user => user.promotions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;
}
