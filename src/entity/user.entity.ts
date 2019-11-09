import { PrimaryGeneratedColumn, Column, ManyToMany, Entity, ManyToOne } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  userType: number;

  @Column({unique: true})
  login: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  firstName: string;

  @Column({nullable: true})
  lastName: string;

  @ManyToMany(type => IcecreamShop, icecreamShop => icecreamShop.employees)
  icecreamShops: IcecreamShop[];

  @ManyToOne(type => IcecreamShop, icecreamShop => icecreamShop.owner)
  ownedIcecreamShops: IcecreamShop[];

}
