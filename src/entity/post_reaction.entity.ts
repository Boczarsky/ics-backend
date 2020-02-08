import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class PostReaction {

  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  post_id: number;

  @Column()
  reaction_type: number;

  @ManyToOne(() => Post, post => post.reactions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'post_id'})
  post: Post;

  @ManyToOne(() => User, user => user.post_reactions, {onDelete: 'CASCADE'})
  @JoinColumn({name: 'user_id'})
  user: User;

}
