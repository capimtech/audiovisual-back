import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { AnimalService } from './entities/animal-service.entity';
import { CreateAnimalServiceDto } from './dto/create-animal-service.dto';
import { UpdateAnimalServiceDto } from './dto/update-animal-service.dto';
import { Animal } from '../animals/entities/animal.entity';
import { PageOptionsCaseInput } from '../common/dto/pageOptions.caseInput';
import { PaginatedEntityResponse } from '../common/presentation/paginatedEntity.response';
import { AttachmentsService } from '../attachments/attachments.service';
import { AnimalServiceAttachment } from './entities/animal-service-attachment.entity';

export type AnimalServiceSortInput = Pick<
  AnimalService,
  'id' | 'date' | 'createdAt'
>;

@Injectable()
export class AnimalServicesService {
  constructor(
    @InjectRepository(AnimalService)
    private readonly serviceRepo: Repository<AnimalService>,
    @InjectRepository(Animal)
    private readonly animalRepo: Repository<Animal>,
    @InjectRepository(AnimalServiceAttachment)
    private readonly attachmentRepo: Repository<AnimalServiceAttachment>,
    @Inject(AttachmentsService)
    private readonly attachmentsService: AttachmentsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateAnimalServiceDto): Promise<AnimalService> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const animal = await queryRunner.manager.findOne(Animal, {
        where: { id: dto.animalId },
      });

      if (!animal) {
        throw new BadRequestException('Animal não encontrado');
      }

      const attachments: AnimalServiceAttachment[] =
        dto?.attachments?.length > 0
          ? dto.attachments.map(
              (attachment) =>
                ({
                  attachmentId:
                    attachment?.attachmentId || attachment?.attachment?.id,
                }) as AnimalServiceAttachment,
            )
          : undefined;

      const service = queryRunner.manager.create(AnimalService, {
        ...dto,
        animal,
        attachments,
      });

      const saved = await queryRunner.manager.save(service);

      await queryRunner.commitTransaction();

      return await this.findOne(saved.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAllByAnimal(
    animalId: string,
    {
      pageNumber = 1,
      pageSize = 10,
      sort = { date: 'DESC' },
    }: PageOptionsCaseInput<AnimalServiceSortInput>,
  ): Promise<PaginatedEntityResponse<AnimalService>> {
    const animal = await this.animalRepo.findOne({ where: { id: animalId } });
    if (!animal) {
      throw new BadRequestException('Animal não encontrado');
    }

    const [data, count] = await this.serviceRepo.findAndCount({
      where: { animal: { id: animalId } },
      order: sort,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      relations: ['animal'],
    });

    const cleaned = data.map((service) => {
      const { animal, ...rest } = service;
      return {
        ...rest,
        animal: {
          id: animal.id,
          name: animal.name,
          isActive: animal.isActive,
        },
      } as AnimalService;
    });

    return new PaginatedEntityResponse(cleaned, count, pageSize);
  }

  async findAll({
    pageNumber = 1,
    pageSize = 10,
    sort = { date: 'DESC' },
  }: PageOptionsCaseInput<AnimalServiceSortInput>): Promise<
    PaginatedEntityResponse<AnimalService>
  > {
    const [data, count] = await this.serviceRepo.findAndCount({
      order: sort,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      relations: ['animal'],
    });

    const cleaned = data.map((service) => {
      const { animal, ...rest } = service;

      return {
        ...rest,
        animal: animal
          ? {
              id: animal.id,
              name: animal.name,
              isActive: animal.isActive,
            }
          : null,
      } as AnimalService;
    });

    return new PaginatedEntityResponse(cleaned, count, pageSize);
  }

  async findOne(id: string): Promise<AnimalService> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['animal', 'attachments'],
    });

    if (!service) {
      throw new BadRequestException('Serviço não encontrado');
    }

    if (service.attachments?.length > 0) {
      await Promise.all(
        service.attachments.map(async (attachment) => {
          try {
            const { attachment: att, presignedGetUrl } =
              await this.attachmentsService.findOne(attachment.attachmentId);
            attachment.attachment = {
              ...att,
              url: presignedGetUrl,
            };
          } catch (error) {
            console.error(
              `Failed to fetch attachment for service ${service.id}:`,
              error,
            );
          }
        }),
      );
    }

    return service;
  }

  async update(
    id: string,
    dto: UpdateAnimalServiceDto,
  ): Promise<AnimalService> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const service = await queryRunner.manager.findOne(AnimalService, {
        where: { id },
        relations: ['attachments'],
      });

      if (!service) {
        throw new BadRequestException('Serviço não encontrado');
      }

      if (dto.animalId) {
        const newAnimal = await queryRunner.manager.findOne(Animal, {
          where: { id: dto.animalId },
        });

        if (!newAnimal) {
          throw new BadRequestException('Animal não encontrado');
        }

        service.animal = newAnimal;
      }

      if (dto.attachments !== undefined) {
        await queryRunner.manager.delete(AnimalServiceAttachment, {
          animalServiceId: id,
        });
      }

      Object.assign(service, dto);

      await queryRunner.manager.save(service);

      await queryRunner.commitTransaction();

      return await this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const service = await queryRunner.manager.findOne(AnimalService, {
        where: { id },
        relations: ['attachments'],
      });

      if (!service) {
        throw new BadRequestException('Serviço não encontrado');
      }

      if (service.attachments?.length > 0) {
        await queryRunner.manager.delete(AnimalServiceAttachment, {
          animalServiceId: id,
        });
      }

      await queryRunner.manager.remove(service);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }
}
