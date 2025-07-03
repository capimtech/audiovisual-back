import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from '../../common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { FilmRequestAttachment } from './film-request-attachment.entity';

@Injectable()
export class FilmRequestAttachmentRepository extends BaseRepositoryAdapter<FilmRequestAttachment> {
  constructor(
    @InjectRepository(FilmRequestAttachment)
    private readonly _: Repository<FilmRequestAttachment>,
  ) {
    super(_);
  }
}
