import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';
import { User } from './user.entity';

@Entity()
export class PostComment {

  @PrimaryGeneratedColumn()
  post_comment_id: number;

  @Column()
  post_id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @ManyToOne(() => Post, post => post.comments)
  @JoinColumn({name: 'post_id'})
  post: Post;

  @ManyToOne(() => User, user => user.post_comments)
  @JoinColumn({name: 'user_id'})
  user: User;

}
