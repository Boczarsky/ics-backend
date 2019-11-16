import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { IcecreamShopUser } from './icecream-shop_user.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn({type: 'int'})
  icecream_shop_id: number;

  @Column({type: 'varchar'})
  name: string;

  @OneToMany(() => IcecreamShopUser, icecreamShopUser => icecreamShopUser.icecream_shop_id)
  employees: IcecreamShopUser[];

  @Column({type: 'int'})
  owner_id: number;

  @ManyToOne(() => User, user => user.owned_icecream_shops)
  @JoinColumn({name: 'owner_id'})
  owner: User;
}
