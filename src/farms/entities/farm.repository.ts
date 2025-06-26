import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Farm } from './farm.entity';

@Injectable()
export class FarmRepository extends BaseRepositoryAdapter<Farm> {
  constructor(
    @InjectRepository(Farm)
    private readonly _: Repository<Farm>,
  ) {
    super(_);
  }
}
