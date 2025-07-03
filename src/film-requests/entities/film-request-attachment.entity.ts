import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { FilmRequest } from './film-request.entity';

@Entity()
export class FilmRequestAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  attachmentId: string;

  @Column({ nullable: false })
  filmRequestId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => FilmRequest, (entity) => entity.attachments)
  filmRequest: FilmRequest;

  attachment?: Attachment;

  url?: string;
}
