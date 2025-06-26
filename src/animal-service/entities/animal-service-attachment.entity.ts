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
import { AnimalService } from './animal-service.entity';

@Entity()
export class AnimalServiceAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  attachmentId: string;

  @Column({ nullable: false })
  animalServiceId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => AnimalService, (entity) => entity.attachments)
  animalService: AnimalService;

  attachment?: Attachment;

  url?: string;
}
