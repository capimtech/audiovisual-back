import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalAttachment } from './animal-attachment.entity';

@Injectable()
export class AnimalAttachmentRepository extends BaseRepositoryAdapter<AnimalAttachment> {
  constructor(
    @InjectRepository(AnimalAttachment)
    private readonly _: Repository<AnimalAttachment>,
  ) {
    super(_);
  }
}
