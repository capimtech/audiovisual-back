import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { AnimalOwner } from './animal-owner.entity';

@Injectable()
export class AnimalOwnerRepository extends BaseRepositoryAdapter<AnimalOwner> {
  constructor(
    @InjectRepository(AnimalOwner)
    private readonly _: Repository<AnimalOwner>,
  ) {
    super(_);
  }
}
