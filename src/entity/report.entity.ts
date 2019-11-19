import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReportComment } from './report_comment.entity';
import { ReportAttachment } from './report_attachment.entity';

@Entity()
export class Report {

  @PrimaryGeneratedColumn()
  report_id: number;

  @Column()
  user_id: number;

  @Column()
  description: string;

  @Column()
  status: number;

  @OneToMany(() => ReportComment, reportComment => reportComment.report)
  comments: ReportComment[];

  @OneToMany(() => ReportAttachment, reportAttachment => reportAttachment.report)
  attachments: ReportAttachment[];

}
