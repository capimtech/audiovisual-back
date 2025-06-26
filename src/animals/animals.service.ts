import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { AnimalRepository } from './entities/animal.repository';
import { PageOptionsCaseInput } from 'src/common/dto/pageOptions.caseInput';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { DataSource } from 'typeorm';
import { AnimalAttachment } from './entities/animal-attachment.entity';
import { AnimalOwner } from 'src/animal-owners/entities/animal-owner.entity';
import { AttachmentsService } from 'src/attachments/attachments.service';

export type ListAnimalsCaseSortInput = Pick<
  Animal,
  'id' | 'createdAt' | 'companyId' | 'isActive'
>;

@Injectable()
export class AnimalsService {
  constructor(
    @Inject(AnimalRepository)
    private readonly repository: AnimalRepository,
    @Inject(AttachmentsService)
    private readonly attachmentsService: AttachmentsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createAnimalDto: CreateAnimalDto): Promise<Animal> {
    if (createAnimalDto?.animalOwners?.length > 0) {
      const totalPercentage = createAnimalDto.animalOwners.reduce(
        (sum, ao) => sum + ao.percentage,
        0,
      );
      if (totalPercentage > 100) {
        throw new BadRequestException(
          'A soma dos percentuais dos proprietários deve ser exatamente 100%!',
        );
      }
    }

    const attachments: AnimalAttachment[] =
      createAnimalDto?.attachments?.length > 0
        ? createAnimalDto?.attachments?.map((attachment) => {
            return {
              attachmentId:
                attachment?.attachmentId || attachment?.attachment?.id,
            } as AnimalAttachment;
          })
        : undefined;

    const animalOwners: AnimalOwner[] =
      createAnimalDto?.animalOwners?.length > 0
        ? createAnimalDto?.animalOwners?.map((ao) => {
            return {
              ownerId: ao?.ownerId,
              percentage: ao?.percentage,
              isResponsible: ao?.isResponsible ?? false,
            } as AnimalOwner;
          })
        : undefined;

    const createdAnimal = await this.repository.create({
      ...createAnimalDto,
      attachments,
      animalOwners,
    });

    return await this.findOne(createdAnimal.id);
  }

  async findAll(
    {
      filter,
      pageNumber = 1,
      pageSize = 10,
      sort = { createdAt: 'DESC' },
    }: PageOptionsCaseInput<ListAnimalsCaseSortInput>,
    activeUser: ActiveUserData,
  ): Promise<PaginatedEntityResponse<Animal>> {
    filter = { ...filter, companyId: { eq: activeUser.companyId } };

    const [data, count] = await this.repository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
      relations: ['animalOwners', 'animalOwners.owner', 'farm'],
    });

    // Fetch attachments and presigned URLs for each animal
    await Promise.all(
      data.map(async (animal) => {
        if (animal.attachmentId) {
          try {
            const { attachment, presignedGetUrl } =
              await this.attachmentsService.findOne(animal.attachmentId);
            animal.image = {
              ...attachment,
              url: presignedGetUrl,
            };
          } catch (error) {
            console.error(
              `Failed to fetch attachment for animal ${animal.id}:`,
              error,
            );
          }
        }

        if (animal.attachments?.length > 0) {
          await Promise.all(
            animal.attachments.map(async (attachment) => {
              try {
                const { attachment: att, presignedGetUrl } =
                  await this.attachmentsService.findOne(
                    attachment.attachmentId,
                  );
                attachment.attachment = {
                  ...att,
                  url: presignedGetUrl,
                };
              } catch (error) {
                console.error(
                  `Failed to fetch attachment for animal ${animal.id}:`,
                  error,
                );
              }
            }),
          );
        }
      }),
    );

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(id: string): Promise<Animal> {
    const model = await this.repository.rawFindOne({
      where: { id },
      relations: ['animalOwners', 'animalOwners.owner', 'farm'],
    });

    if (!model) {
      throw new NotFoundException(`Animal with ID ${id} not found`);
    }

    if (model.attachmentId) {
      try {
        const { attachment, presignedGetUrl } =
          await this.attachmentsService.findOne(model.attachmentId);
        model.image = {
          ...attachment,
          url: presignedGetUrl,
        };
      } catch (error) {
        console.error(
          `Failed to fetch attachment for category ${model.id}:`,
          error,
        );
      }
    }

    if (model.attachments?.length > 0) {
      await Promise.all(
        model.attachments.map(async (attachment) => {
          try {
            const { attachment: att, presignedGetUrl } =
              await this.attachmentsService.findOne(attachment.attachmentId);
            attachment.attachment = {
              ...att,
              url: presignedGetUrl,
            };
          } catch (error) {
            console.error(
              `Failed to fetch attachment for animal ${model.id}:`,
              error,
            );
          }
        }),
      );
    }

    return model;
  }

  async update(id: string, updateAnimalDto: UpdateAnimalDto): Promise<Animal> {
    const existing = await this.findOne(id);
    if (!existing) throw new BadRequestException('Animal not found');

    // Validate animalOwners percentage if provided
    if (updateAnimalDto?.animalOwners?.length > 0) {
      const totalPercentage = updateAnimalDto.animalOwners.reduce(
        (sum, ao) => sum + ao.percentage,
        0,
      );
      if (totalPercentage > 100) {
        throw new BadRequestException(
          'A soma dos percentuais dos proprietários deve ser exatamente 100%!',
        );
      }
    }

    // Always remove existing animalOwners and attachments if new arrays are provided
    if (updateAnimalDto.animalOwners !== undefined) {
      await this.dataSource.getRepository(AnimalOwner).delete({ animalId: id });
    }
    if (updateAnimalDto.attachments !== undefined) {
      await this.dataSource
        .getRepository(AnimalAttachment)
        .delete({ animalId: id });
    }

    // Prepare new attachments
    const attachments: AnimalAttachment[] =
      updateAnimalDto?.attachments?.length > 0
        ? updateAnimalDto.attachments.map(
            (attachment) =>
              ({
                attachmentId:
                  attachment?.attachmentId || attachment?.attachment?.id,
                animalId: id,
              }) as AnimalAttachment,
          )
        : undefined;

    // Prepare new animalOwners
    const animalOwners: AnimalOwner[] =
      updateAnimalDto?.animalOwners?.length > 0
        ? updateAnimalDto.animalOwners.map(
            (ao) =>
              ({
                ownerId: ao.ownerId,
                percentage: ao.percentage,
                isResponsible: ao.isResponsible ?? false,
                animalId: id,
              }) as AnimalOwner,
          )
        : undefined;

    // Update the animal (without relations)
    await this.repository.save({
      ...existing,
      ...updateAnimalDto,
      attachments: undefined,
      animalOwners: undefined,
    });

    // Insert new relations if present
    if (attachments?.length > 0) {
      await this.dataSource.getRepository(AnimalAttachment).save(attachments);
    }
    if (animalOwners?.length > 0) {
      await this.dataSource.getRepository(AnimalOwner).save(animalOwners);
    }

    return await this.findOne(id);
  }

  async activate(id: string) {
    const model = await this.findOne(id);
    if (model.isActive) {
      throw new BadRequestException('Animal já está ativo.');
    }
    await this.repository.update(id, { isActive: true });
    return await this.findOne(id);
  }

  async inactivate(id: string) {
    const model = await this.findOne(id);
    if (!model.isActive) {
      throw new BadRequestException('Animal já está inativo.');
    }
    await this.repository.update(id, { isActive: false });
    return await this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);
    await this.repository.softDelete(model.id);
  }
}
