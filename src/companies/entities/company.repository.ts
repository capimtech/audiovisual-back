import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyRepository extends BaseRepositoryAdapter<Company> {
  constructor(
    @InjectRepository(Company)
    private readonly _: Repository<Company>,
  ) {
    super(_);
  }
}
