import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Opinion } from './opinion.entity';
import { User } from './user.entity';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class OpinionComment {

  @PrimaryGeneratedColumn()
  opinion_comment_id: number;

  @Column()
  opinion_id: number;

  @Column()
  user_id: number;

  @Column({nullable: true})
  icecream_shop_id: number;

  @Column()
  content: string;

  @ManyToOne(() => Opinion, opinion => opinion.comments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'opinion_id'})
  opinion: Opinion;

  @ManyToOne(() => User, user => user.opinion_comments, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.opinion_responses, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
