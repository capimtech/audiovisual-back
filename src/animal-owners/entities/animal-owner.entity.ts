import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Animal } from '../../animals/entities/animal.entity';
import { Owner } from '../../owners/entities/owner.entity';

@Entity()
export class AnimalOwner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  animalId: string;

  @Column()
  ownerId: string;

  @Column({ type: 'float', nullable: true })
  percentage: number;

  @Column({ nullable: false, default: false })
  isResponsible: boolean;

  @ManyToOne(() => Animal, (animal) => animal.animalOwners, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'animalId' })
  animal: Animal;

  @ManyToOne(() => Owner, { eager: true })
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
