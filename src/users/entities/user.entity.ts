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
import { Role } from '../enums/role.enum';

@Entity('users')
@Index(`EMAIL`, ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  image: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ enum: Role, default: Role.CASEIRO })
  role: Role;

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

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.users)
  company: Company;
}
