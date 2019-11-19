import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Opinion } from './opinion.entity';
import { User } from './user.entity';

@Entity()
export class OpinionComment {

  @PrimaryGeneratedColumn()
  opinion_comment_id: number;

  @Column()
  opinion_id: number;

  @Column()
  user_id: number;

  @Column()
  content: number;

  @ManyToOne(() => Opinion, opinion => opinion.comments)
  @JoinColumn({name: 'opinion_id'})
  opinion: Opinion;

  @ManyToOne(() => User, user => user.opinion_comments)
  @JoinColumn({name: 'user_id'})
  user: User;

}
