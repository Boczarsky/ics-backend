import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity()
export class PostAttachment {

  @PrimaryGeneratedColumn()
  post_attachment_id: number;

  @Column()
  post_id: number;

  @Column()
  file_path: string;

  @Column()
  file_name: string;

  @Column()
  file_ext: string;

  @ManyToOne(() => Post, post => post.attachments)
  @JoinColumn({name: 'post_id'})
  post: Post;

}
