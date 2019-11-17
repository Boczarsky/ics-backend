import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { EmployeeWorkplace } from './employee_workplace.entity';
import { FavoriteFollower } from './favorite_follower.entity';

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

  @ManyToOne(() => User, manager => manager.employees)
  @JoinColumn({name: 'manager_id'})
  manager: User;

  @OneToMany(() => User, employee => employee.manager)
  employees: User[];

  @OneToMany(() => EmployeeWorkplace, ew => ew.employee)
  workplaces: EmployeeWorkplace[];

  @OneToMany(() => IcecreamShop, icecreamShop => icecreamShop.owner)
  icecream_shops: IcecreamShop[];

  @OneToMany(() => FavoriteFollower, ff => ff.follower)
  favorites: FavoriteFollower[];

}
