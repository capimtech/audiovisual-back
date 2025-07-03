import {
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
} from 'typeorm';
import { ProductionType } from '../enums/production-type.enum';
import { Status } from '../enums/status.enum';
import { FilmRequestAttachment } from './film-request-attachment.entity';

@Entity('film_requests')
export class FilmRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  productionName: string;

  @Column({ nullable: false })
  productionCompany: string;

  @Column({ nullable: false })
  legalRepresentative: string;

  @Column({ enum: ProductionType, nullable: false })
  productionType: ProductionType;

  @Column({ enum: Status, nullable: false })
  status: Status;

  @Column({ nullable: false })
  crewSize: number;

  @Column({ nullable: false })
  filmingSchedule: string;

  @Column({ nullable: false })
  requestedLocations: string;

  @Column({ nullable: false })
  synopsis: string;

  @Column({ nullable: false })
  filmingPlan: string;

  @Column({ nullable: false })
  equipmentList: string;

  @Column({ nullable: false })
  estimatedImpacts: string;

  @Column({ nullable: false })
  municipalSupportRequired: boolean;

  @Column({ nullable: true })
  municipalSupportDetails?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(
    () => FilmRequestAttachment,
    (attachment) => attachment.filmRequest,
    { eager: false, cascade: true },
  )
  attachments: FilmRequestAttachment[];
}
