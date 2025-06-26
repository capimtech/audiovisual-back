import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Supply } from './supply.entity';

@Injectable()
export class SupplyRepository extends BaseRepositoryAdapter<Supply> {
  constructor(
    @InjectRepository(Supply)
    private readonly _: Repository<Supply>,
  ) {
    super(_);
  }
}
