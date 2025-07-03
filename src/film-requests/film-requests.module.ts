import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilmRequestsService } from './film-requests.service';
import { FilmRequestsController } from './film-requests.controller';
import { FilmRequest } from './entities/film-request.entity';
import { FilmRequestAttachment } from './entities/film-request-attachment.entity';
import { FilmRequestRepository } from './entities/film-request.repository';
import { FilmRequestAttachmentRepository } from './entities/film-request-attachment.repository';

import { AttachmentsModule } from './../attachments/attachments.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FilmRequest, FilmRequestAttachment]),
    AttachmentsModule,
  ],
  controllers: [FilmRequestsController],
  providers: [
    FilmRequestsService,
    FilmRequestRepository,
    FilmRequestAttachmentRepository,
  ],
})
export class FilmRequestsModule {}
