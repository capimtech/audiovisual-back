import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Profile } from '../enums/profile.enum';
import { AreaOfActivity } from '../enums/area-of-activity.enum';

@Entity('users')
@Index('EMAIL', ['email'], { unique: true })
@Index('CPF', ['cpf'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: true, unique: true })
  cpf: string;

  @Column({ nullable: true, unique: true })
  cnpj: string;

  @Column({ nullable: true })
  adress: string;

  @Column({ nullable: true })
  district: string;

  @Column({ nullable: true })
  cep: number;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ enum: AreaOfActivity, nullable: true })
  areaOfActivity: AreaOfActivity;

  @Column({ enum: Profile, default: Profile.REQUISITANTE })
  profile: Profile;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true, select: false })
  googleId: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: true })
  temporaryPassword: boolean;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  expirationCode: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @Column({ name: 'company_id', type: 'uuid', nullable: true }) // Nullable para usuários sem empresa
  companyId: string;

  @ManyToOne(() => Company, (company) => company.users, { nullable: true })
  company: Company;
}
