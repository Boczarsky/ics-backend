import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn({type: 'int'})
  icecreamShopId: number;

  @Column({type: 'varchar'})
  name: string;

  @ManyToOne(type => User, user => user.icecreamShop)
  employees: User[];

  @OneToMany(type => User, user => user.ownedIcecreamShops)
  owner: User;
}
