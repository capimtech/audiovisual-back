import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Animal } from './animal.entity';

@Injectable()
export class AnimalRepository extends BaseRepositoryAdapter<Animal> {
  constructor(
    @InjectRepository(Animal)
    private readonly _: Repository<Animal>,
  ) {
    super(_);
  }
}
