import { Entity, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class Employment {

  @PrimaryColumn({type: 'int'})
  icecream_shop_id: number;

  @PrimaryColumn({type: 'int'})
  user_id: number;

  @ManyToOne(() => User, user => user.workplaces, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  employee: User;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.employees)
  @JoinColumn({name: 'icecream_shop_id'})
  workplace: IcecreamShop;

}
