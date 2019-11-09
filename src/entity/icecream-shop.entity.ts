import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  name: string;

  @ManyToMany(type => User, user => user.icecreamShops)
  @JoinTable()
  employees: User[];

  @OneToMany(type => User, user => user.ownedIcecreamShops)
  owner: User;
}
