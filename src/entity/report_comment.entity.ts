import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from './report.entity';
import { User } from './user.entity';

@Entity()
export class ReportComment {

  @PrimaryGeneratedColumn()
  report_comment_id: number;

  @Column()
  report_id: number;

  @Column()
  user_id: number;

  @Column()
  content: string;

  @ManyToOne(() => Report, report => report.comments)
  @JoinColumn({name: 'report_id'})
  report: Report;

  @ManyToOne(() => User, user => user.report_comments)
  @JoinColumn({name: 'user_id'})
  user: User;

}
