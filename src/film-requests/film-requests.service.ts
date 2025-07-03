import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { FilmRequest } from './entities/film-request.entity';
import { FilmRequestAttachment } from './entities/film-request-attachment.entity';
import { FilmRequestRepository } from './entities/film-request.repository';
import { CreateFilmRequestDto } from './dto/create-film-request.dto';
import { UpdateFilmRequestDto } from './dto/update-film-request.dto';
import { AttachmentsService } from './../attachments/attachments.service';
import { PageOptionsCaseInput } from './../common/dto/pageOptions.caseInput';
import { PaginatedEntityResponse } from './../common/presentation/paginatedEntity.response';

export type ListFilmRequestsCaseSortInput = Pick<
  FilmRequest,
  'id' | 'createdAt'
>;

@Injectable()
export class FilmRequestsService {
  constructor(
    private readonly repository: FilmRequestRepository,
    private readonly attachmentsService: AttachmentsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createFilmRequestDto: CreateFilmRequestDto,
  ): Promise<FilmRequest> {
    const attachments: Partial<FilmRequestAttachment>[] =
      createFilmRequestDto.attachments?.length > 0
        ? createFilmRequestDto.attachments.map((a) => ({
            attachmentId: a.attachmentId,
          }))
        : undefined;

    const created = await this.repository.create({
      ...createFilmRequestDto,
      attachments,
    });

    return this.findOne(created.id);
  }

  async findAll({
    filter,
    pageNumber = 1,
    pageSize = 10,
    sort = { createdAt: 'DESC' },
  }: PageOptionsCaseInput<ListFilmRequestsCaseSortInput>) {
    filter = { ...filter };
    const [data, count] = await this.repository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
      relations: ['attachments'],
    });

    await Promise.all(
      data.map((fr) =>
        Promise.all(
          fr.attachments?.map(async (att) => {
            const { attachment, presignedGetUrl } =
              await this.attachmentsService.findOne(att.attachmentId);
            att.attachment = attachment;
            att.url = presignedGetUrl;
          }) ?? [],
        ),
      ),
    );

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(id: string): Promise<FilmRequest> {
    const model = await this.repository.rawFindOne({
      where: { id },
      relations: ['attachments'],
    });
    if (!model) throw new NotFoundException(`FilmRequest ${id} not found`);

    await Promise.all(
      model.attachments?.map(async (att) => {
        const { attachment, presignedGetUrl } =
          await this.attachmentsService.findOne(att.attachmentId);
        att.attachment = attachment;
        att.url = presignedGetUrl;
      }) ?? [],
    );

    return model;
  }

  async update(
    id: string,
    updateFilmRequestDto: UpdateFilmRequestDto,
  ): Promise<FilmRequest> {
    const existing = await this.findOne(id);
    if (!existing) throw new BadRequestException('Not found');

    if (updateFilmRequestDto.attachments !== undefined) {
      await this.dataSource
        .getRepository(FilmRequestAttachment)
        .delete({ filmRequestId: id });
    }

    const attachments: Partial<FilmRequestAttachment>[] =
      updateFilmRequestDto.attachments?.length > 0
        ? updateFilmRequestDto.attachments.map((a) => ({
            attachmentId: a.attachmentId,
            filmRequestId: id,
          }))
        : undefined;

    await this.repository.save({
      ...existing,
      ...updateFilmRequestDto,
      attachments: undefined,
    });

    if (attachments?.length > 0) {
      await this.dataSource
        .getRepository(FilmRequestAttachment)
        .save(attachments);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.repository.softDelete(id);
  }
}
