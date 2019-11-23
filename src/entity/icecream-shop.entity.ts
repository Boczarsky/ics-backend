import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinTable, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { Employment } from './employment.entity';
import { Follower } from './follower.entity';
import { IcecreamFlavour } from './icecream_flavour.entity';
import { Localization } from './localization.entity';
import { Post } from './post.entity';
import { Opinion } from './opinion.entity';
import { OpinionComment } from './opinion_comment.entity';
import { PostComment } from './post_comment.entity';

@Entity()
export class IcecreamShop {

  @PrimaryGeneratedColumn()
  icecream_shop_id: number;

  @Column({nullable: true})
  logo_id: number;

  @Column({nullable: true})
  photo_id: number;

  @Column({nullable: true})
  localization_id: number;

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
  photo_file_name: string;

  @ManyToOne(() => User, user => user.icecream_shops)
  @JoinColumn({name: 'owner_id'})
  owner: User;

  @OneToMany(() => Employment, ew => ew.workplace)
  employees: Employment[];

  @OneToMany(() => Follower, ff => ff.favorite)
  followers: Follower[];

  @OneToMany(() => IcecreamFlavour, icecreamFlavour => icecreamFlavour.icecream_shop)
  flavours: IcecreamFlavour[];

  @OneToOne(() => Localization, localization => localization.icecream_shop)
  @JoinColumn({name: 'localization_id'})
  localization: Localization;

  @OneToMany(() => Post, post => post.icecream_shop)
  posts: Post[];

  @OneToMany(() => Opinion, opinion => opinion.icecream_shop)
  opinions: Opinion[];

  @OneToMany(() => OpinionComment, opinionResponse => opinionResponse.icecream_shop)
  opinion_responses: OpinionComment[];

  @OneToMany(() => PostComment, postResponse => postResponse.icecream_shop)
  post_responses: PostComment[];

}
