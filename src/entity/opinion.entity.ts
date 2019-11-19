import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { OpinionComment } from './opinion_comment.entity';
import { User } from './user.entity';

Entity();
export class Opinion {

  @PrimaryGeneratedColumn()
  opinion_id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @OneToMany(() => OpinionComment, opinionComment => opinionComment)
  comments: OpinionComment[];

  @ManyToOne(() => User, user => user.opinions)
  @JoinColumn({name: 'user_id'})
  user: User;

}
