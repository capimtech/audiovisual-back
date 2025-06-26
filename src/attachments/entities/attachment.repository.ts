import { Injectable } from '@nestjs/common';
import { BaseRepositoryAdapter } from 'src/common/baseRepository';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Attachment } from './attachment.entity';

@Injectable()
export class AttachmentRepository extends BaseRepositoryAdapter<Attachment> {
  constructor(
    @InjectRepository(Attachment)
    private readonly _: Repository<Attachment>,
  ) {
    super(_);
  }
}
