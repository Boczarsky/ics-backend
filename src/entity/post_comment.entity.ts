import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';
import { IcecreamShop } from './icecream-shop.entity';

@Entity()
export class PostComment {

  @PrimaryGeneratedColumn()
  post_comment_id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  created_at: string;

  @Column()
  content: string;

  @Column({nullable: true})
  icecream_shop_id: number;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({name: 'post_id'})
  post: Post;

  @ManyToOne(() => User, user => user.post_comments)
  @JoinColumn({name: 'user_id'})
  user: User;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.post_responses)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

}
