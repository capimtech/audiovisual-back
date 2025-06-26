import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { AnimalServiceAttachment } from './animal-service-attachment.entity';

@Entity('animal_services')
export class AnimalService {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Animal, (animal) => animal.services, { eager: true })
  @JoinColumn({ name: 'animal_id' })
  animal: Animal;

  @Column()
  type: string;

  @Column('text')
  description: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(
    () => AnimalServiceAttachment,
    (attachment) => attachment.animalService,
    { eager: false, cascade: true },
  )
  attachments: AnimalServiceAttachment[];
}
