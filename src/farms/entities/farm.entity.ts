import { Owner } from '../../owners/entities/owner.entity';
import { Animal } from '../../animals/entities/animal.entity';
import { Company } from '../../companies/entities/company.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, default: false })
  isOwned: boolean;

  @Column({ nullable: true })
  adminContactName?: string;

  @Column({ nullable: true })
  adminContactPhone?: string;

  @Column({ nullable: true })
  adminContactEmail?: string;

  @Column({ nullable: true })
  financialContactName?: string;

  @Column({ nullable: true })
  financialContactPhone?: string;

  @Column({ nullable: true })
  financialContactEmail?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'ownerId', type: 'uuid', nullable: true })
  ownerId: string;

  @ManyToOne(() => Company, (company) => company.farms)
  company: Company;

  @OneToMany(() => Animal, (entity) => entity.farm)
  animals: Animal[];

  @ManyToOne(() => Owner, (entity) => entity.farms, {
    eager: true,
  })
  owner: Owner;

  @Column({ default: true })
  status: boolean;
}
