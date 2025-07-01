import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Farm } from '../../farms/entities/farm.entity';
import { Animal } from '../../animals/entities/animal.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;

  @OneToMany(() => User, (entity) => entity.company)
  users: User[];

  @OneToMany(() => Farm, (entity) => entity.company)
  farms: Farm[];

  @OneToMany(() => Farm, (entity) => entity.company)
  animals: Animal[];
}
