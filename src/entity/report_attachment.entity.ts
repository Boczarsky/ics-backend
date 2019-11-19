import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class ReportAttachment {

  @PrimaryGeneratedColumn()
  report_attachemnt_id: number;

  @Column()
  report_id: number;

  @Column()
  file_path: string;

  @Column()
  file_name: string;

  @Column()
  file_ext: string;

  @ManyToOne(() => Report, report => report.attachments)
  @JoinColumn({name: 'report_id'})
  report: Report[];

}
