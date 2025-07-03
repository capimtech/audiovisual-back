import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from '../../common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmRequest } from './film-request.entity';

@Injectable()
export class FilmRequestRepository extends BaseRepositoryAdapter<FilmRequest> {
  constructor(
    @InjectRepository(FilmRequest)
    private readonly _: Repository<FilmRequest>,
  ) {
    super(_);
  }
}
