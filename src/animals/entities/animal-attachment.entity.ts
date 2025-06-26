import { Attachment } from '../../attachments/entities/attachment.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Animal } from './animal.entity';

@Entity()
export class AnimalAttachment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  attachmentId: string;

  @Column({ nullable: false })
  animalId: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Animal, (entity) => entity.attachments)
  animal: Animal;

  attachment?: Attachment;

  url?: string;
}
