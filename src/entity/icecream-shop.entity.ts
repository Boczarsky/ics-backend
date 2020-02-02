import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Employment } from './employment.entity';
import { Follower } from './follower.entity';
import { IcecreamFlavour } from './icecream_flavour.entity';
import { Post } from './post.entity';
import { Opinion } from './opinion.entity';
import { OpinionComment } from './opinion_comment.entity';
import { OpenDay } from './open_day.entity';
import { SpecialDay } from './special_day.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn()
  icecream_shop_id: number;

  @Column()
  owner_id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  postal_code: string;

  @Column()
  description: string;

  @Column({nullable: true})
  logo_file_name: string;

  @Column({nullable: true})
  background_file_name: string;

  @Column({nullable: true})
  google_map_link: string;

  @OneToMany(() => OpenDay, od => od.icecream_shop)
  open_days: OpenDay[];

  @OneToMany(() => SpecialDay, od => od.icecream_shop)
  special_days: SpecialDay[];

  @ManyToOne(() => User, user => user.icecream_shops)
  @JoinColumn({name: 'owner_id'})
  owner: User;

  @OneToMany(() => Employment, ew => ew.workplace)
  employees: Employment[];

  @OneToMany(() => Follower, ff => ff.favorite)
  followers: Follower[];

  @OneToMany(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.icecream_shop)
  flavours: IcecreamFlavour[];

  @OneToMany(() => Post, post => post.icecream_shop)
  posts: Post[];

  @OneToMany(() => Opinion, opinion => opinion.icecream_shop)
  opinions: Opinion[];

  @OneToMany(() => OpinionComment, opinionResponse => opinionResponse.icecream_shop)
  opinion_responses: OpinionComment[];

}
