import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { IcecreamShop } from './icecream-shop.entity';
import { PostAttachment } from './post_attachment.entity';
import { PostComment } from './post_comment.entity';
import { PostReaction } from './post_reaction.entity';

@Entity()
export class Post {

  @PrimaryGeneratedColumn()
  post_id: number;

  @Column()
  icecream_shop_id: number;

  @Column()
  content: string;

  @ManyToOne(() => IcecreamShop, icecreamShop => icecreamShop.posts)
  @JoinColumn({name: 'icecream_shop_id'})
  icecream_shop: IcecreamShop;

  @OneToMany(() => PostAttachment, postAttachment => postAttachment.post)
  attachments: PostAttachment[];

  @OneToMany(() => PostComment, postComment => postComment.post)
  comments: PostComment[];

  @OneToMany(() => PostReaction, postReaction => postReaction.post)
  reactions: PostReaction[];

}
