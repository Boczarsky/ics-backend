import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { PostReaction } from './post_reaction.entity';

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  created_at: string;

  @Column()
  content: string;

  @Column({nullable: true})
  file_name: string;

  @Column()
  title: string;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.posts)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

  @OneToMany(() => PostReaction, postReaction => postReaction.post, {eager: true})
  reactions: PostReaction[];

}
