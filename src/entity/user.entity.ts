import { PrimaryGeneratedColumn, Column, Entity, OneToMany, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { Employment } from './employment.entity';
import { Follower } from './follower.entity';
import { Avatar } from './avatar.entity';
import { Coupon } from './coupon.entity';
import { OpinionComment } from './opinion_comment.entity';
import { Opinion } from './opinion.entity';
import { PostComment } from './post_comment.entity';
import { ReportComment } from './report_comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({nullable: true})
  manager_id: number;

  @Column()
  user_type: number;

  @Column({unique: true})
  login: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  first_name: string;

  @Column({nullable: true})
  last_name: string;

  @ManyToOne(() => User, manager => manager.employees)
  @JoinColumn({name: 'manager_id'})
  manager: User;

  @OneToMany(() => User, employee => employee.manager)
  employees: User[];

  @OneToMany(() => Employment, ew => ew.employee)
  workplaces: Employment[];

  @OneToMany(() => IcecreamShop, icecreamShop => icecreamShop.owner)
  icecream_shops: IcecreamShop[];

  @OneToMany(() => Follower, ff => ff.follower)
  favorites: Follower[];

  @OneToOne(() => Avatar, avatar => avatar.user)
  avatar: Avatar;

  @OneToMany(() => Coupon, coupon => coupon.user)
  coupons: Coupon[];

  @OneToMany(() => OpinionComment, opinionComment => opinionComment.user)
  opinion_comments: OpinionComment[];

  @OneToMany(() => Opinion, opinion => opinion.user)
  opinions: Opinion[];

  @OneToMany(() => PostComment, postComment => postComment.user)
  post_comments: PostComment[];

  @OneToMany(() => ReportComment, reportComment => reportComment.user)
  report_comments: ReportComment[];

}
