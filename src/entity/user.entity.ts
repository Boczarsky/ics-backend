import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { IcecreamShopUser } from './icecream-shop_user.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({type: 'int'})
  user_id: number;

  @Column({type: 'int'})
  user_type: number;

  @Column({type: 'varchar', unique: true})
  login: string;

  @Column({type: 'varchar', unique: true})
  email: string;

  @Column({type: 'varchar'})
  password: string;

  @Column({type: 'varchar', nullable: true})
  first_name: string;

  @Column({type: 'varchar', nullable: true})
  last_name: string;

  @Column({type: 'int', nullable: true})
  manager_id: number;

  @ManyToOne(() => User, manager => manager.user_id)
  @JoinColumn({name: 'manager_id'})
  manager: User;

  @OneToMany(() => User, employee => employee.manager_id)
  employees: User[];

  @OneToMany(() => IcecreamShopUser, icecreamShopUser => icecreamShopUser.user_id)
  workplaces: IcecreamShopUser[];

  @OneToMany(() => IcecreamShop, icecreamShop => icecreamShop.owner_id)
  owned_icecream_shops: IcecreamShop[];

}
