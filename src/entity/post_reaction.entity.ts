import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostReaction {

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  post_id: number;

  @Column()
  reaction_type: number;

  @ManyToOne(() => Post, post => post.reactions)
  @JoinColumn({name: 'post_id'})
  post: Post;

}
