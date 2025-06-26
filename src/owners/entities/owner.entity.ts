import { Animal } from '../../animals/entities/animal.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { AnimalOwner } from '../../animal-owners/entities/animal-owner.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  cpfCnpj: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column({ nullable: true })
  adminContactName: string;

  @Column({ nullable: true })
  adminContactPhone: string;

  @Column({ nullable: true })
  adminContactEmail: string;

  @Column({ nullable: true })
  financialContactName: string;

  @Column({ nullable: true })
  financialContactPhone: string;

  @Column({ nullable: true })
  financialContactEmail: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => Animal, (entity) => entity.company)
  animals: Animal[];

  @OneToMany(() => Farm, (entity) => entity.owner)
  farms: Farm[];

  @OneToMany(() => AnimalOwner, (animalOwner) => animalOwner.owner)
  animalOwners: AnimalOwner[];
}
