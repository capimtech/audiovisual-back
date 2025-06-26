import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Owner } from './owner.entity';

@Injectable()
export class OwnerRepository extends BaseRepositoryAdapter<Owner> {
  constructor(
    @InjectRepository(Owner)
    private readonly _: Repository<Owner>,
  ) {
    super(_);
  }
}
