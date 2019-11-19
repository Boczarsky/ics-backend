import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Avatar {

  @PrimaryColumn()
  user_id: number;

  @Column()
  file_path: string;

  @Column()
  file_name: string;

  @Column()
  file_ext: string;

  @OneToOne(() => User, user => user.avatar)
  @JoinColumn({name: 'user_id'})
  user: User;

}
