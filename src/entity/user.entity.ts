import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn({type: 'int'})
  userId: number;

  @Column({type: 'varchar'})
  userType: number;

  @Column({type: 'varchar', unique: true})
  login: string;

  @Column({type: 'varchar'})
  email: string;

  @Column({type: 'varchar'})
  password: string;

  @Column({type: 'varchar', nullable: true})
  firstName: string;

  @Column({type: 'varchar', nullable: true})
  lastName: string;

  @ManyToOne(type => IcecreamShop, icecreamShop => icecreamShop.employees)
  icecreamShop: IcecreamShop;

  @OneToMany(type => IcecreamShop, icecreamShop => icecreamShop.owner)
  ownedIcecreamShops: IcecreamShop[];

}
