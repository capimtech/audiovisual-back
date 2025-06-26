import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from '../../common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalService } from './animal-service.entity';

@Injectable()
export class AnimalServiceRepository extends BaseRepositoryAdapter<AnimalService> {
  constructor(
    @InjectRepository(AnimalService)
    private readonly _: Repository<AnimalService>,
  ) {
    super(_);
  }
}
