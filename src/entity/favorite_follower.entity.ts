import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { User } from './user.entity';

@Entity()
export class FavoriteFollower {
  @PrimaryColumn()
  user_id: number;
  @PrimaryColumn()
  icecream_shop_id: number;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.followers)
  @JoinColumn({name: 'icecream_shop_id'})
  favorite: IcecreamShop;

  @ManyToOne(() => User, user => user.favorites)
  @JoinColumn({name: 'user_id'})
  follower: User;

}
