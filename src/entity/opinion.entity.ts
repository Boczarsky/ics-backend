import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { OpinionComment } from './opinion_comment.entity';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class Opinion {

  @PrimaryGeneratedColumn()
  opinion_id: number;

  @Column()
  user_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  created_at: string;

  @Column()
  content: string;

  @Column()
  grade: number;

  @OneToMany(() => OpinionComment, opinionComment => opinionComment.opinion, {eager: true})
  comments: OpinionComment[];

  @ManyToOne(() => User, user => user.opinions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.opinions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
