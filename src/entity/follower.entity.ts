import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { User } from './user.entity';

@Entity()
export class Follower {

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  icecream_shop_id: number;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.followers, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'icecream_shop_id'})
  favorite: IcecreamShop;

  @ManyToOne(() => User, user => user.favorites, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  follower: User;

}
