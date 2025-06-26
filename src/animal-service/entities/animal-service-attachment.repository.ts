import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from '../../common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnimalServiceAttachment } from './animal-service-attachment.entity';

@Injectable()
export class AnimalServiceAttachmentRepository extends BaseRepositoryAdapter<AnimalServiceAttachment> {
  constructor(
    @InjectRepository(AnimalServiceAttachment)
    private readonly _: Repository<AnimalServiceAttachment>,
  ) {
    super(_);
  }
}
