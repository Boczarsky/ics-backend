import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { EmployeeWorkplace } from './employee_workplace.entity';
import { FavoriteFollower } from './favorite_follower.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn({type: 'int'})
  icecream_shop_id: number;

  @Column({type: 'varchar'})
  name: string;

  @Column({type: 'int'})
  owner_id: number;

  @ManyToOne(() => User, user => user.icecream_shops)
  @JoinColumn({name: 'owner_id'})
  owner: User;

  @OneToMany(() => EmployeeWorkplace, ew => ew.workplace)
  employees: EmployeeWorkplace[];

  @OneToMany(() => FavoriteFollower, ff => ff.favorite)
  followers: FavoriteFollower[];

}
