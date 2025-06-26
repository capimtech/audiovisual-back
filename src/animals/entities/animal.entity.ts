import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Farm } from '../../farms/entities/farm.entity';
import { Company } from '../../companies/entities/company.entity';
import { ColumnNumericTransformer } from '../../utils/columnNumericTransformer';
import { AnimalOwner } from '../../animal-owners/entities/animal-owner.entity';
import { Attachment } from '../../attachments/entities/attachment.entity';
import { AnimalAttachment } from './animal-attachment.entity';
import { AnimalService } from '../../animal-service/entities/animal-service.entity';

@Entity('animals')
export class Animal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  nickname: string;

  @Column({ nullable: true })
  genre: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  earpiece: string;

  @Column({ nullable: true })
  function: string;

  @Column({ nullable: true })
  registerDate: Date;

  @Column({ nullable: false, default: false })
  isRegistered: boolean;

  @Column({ nullable: true })
  registerNumber: string;

  @Column({ nullable: false, default: false })
  isChipped: boolean;

  @Column({ nullable: true })
  chipNumber: string;

  @Column({ nullable: false, default: false })
  rationControl: boolean;

  @Column({ nullable: true })
  species: string;

  @Column({ nullable: true })
  race: string;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  coat: string;

  @Column({ nullable: false, default: false })
  availableForSale: boolean;

  @Column({ nullable: false, default: 'DESCONHECIDA' })
  condition: string;

  @Column({ nullable: true })
  father?: string;

  @Column({ nullable: true })
  mother?: string;

  @Column({ nullable: true })
  paternalGrandmother?: string;

  @Column({ nullable: true })
  paternalGrandfather?: string;

  @Column({ nullable: true })
  maternalGrandmother?: string;

  @Column({ nullable: true })
  maternalGrandfather?: string;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  marketValue: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  saleValue: number;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  minimumSaleValue: number;

  @Column({ nullable: false, default: false })
  repTird: boolean;

  @Column({ nullable: true })
  registerType: string;

  @Column({ nullable: true })
  invoiceClose: string;

  @Column({ nullable: true })
  generation: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  status: string;

  @Column({ name: 'farmId', type: 'uuid', nullable: true })
  farmId: string;

  @Column({ name: 'companyId', type: 'uuid' })
  companyId: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'uuid',
    nullable: true,
  })
  attachmentId: string;

  @OneToOne(() => Attachment, { eager: true })
  @JoinColumn({
    name: 'attachmentId',
  })
  image: Attachment;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @ManyToOne(() => Company, (company) => company.animals)
  company: Company;

  @ManyToOne(() => Farm, (entity) => entity.animals)
  farm: Farm;

  @OneToMany(() => AnimalOwner, (ao) => ao.animal, {
    eager: true,
    cascade: true,
  })
  animalOwners: AnimalOwner[];

  @OneToMany(() => AnimalAttachment, (attachment) => attachment.animal, {
    eager: true,
    cascade: true,
  })
  attachments: AnimalAttachment[];

  @OneToMany(() => AnimalService, (service) => service.animal)
  services: AnimalService[];
}
