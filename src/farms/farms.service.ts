import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { Farm } from './entities/farm.entity';
import { FarmRepository } from './entities/farm.repository';
import { PageOptionsCaseInput } from 'src/common/dto/pageOptions.caseInput';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { AnimalRepository } from 'src/animals/entities/animal.repository';

export type ListFarmsCaseSortInput = Pick<
  Farm,
  'id' | 'createdAt' | 'companyId' | 'status'
>;

@Injectable()
export class FarmsService {
  constructor(
    @Inject(FarmRepository)
    private readonly repository: FarmRepository,
    @Inject(AnimalRepository)
    private readonly animalRepository: AnimalRepository,
  ) {}

  async create(createFarmDto: CreateFarmDto): Promise<Farm> {
    return await this.repository.create(createFarmDto);
  }

  async findAll(
    {
      filter,
      pageNumber = 1,
      pageSize = 10,
      sort = { createdAt: 'DESC' },
    }: PageOptionsCaseInput<ListFarmsCaseSortInput>,
    activeUser: ActiveUserData,
  ): Promise<PaginatedEntityResponse<Farm>> {
    filter = { ...filter, companyId: { eq: activeUser.companyId } };

    const [data, count] = await this.repository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
      relations: ['animals'],
    });

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(id: string): Promise<Farm> {
    const model = await this.repository.rawFindOne({
      where: { id },
      relations: ['animals'],
    });

    if (!model) {
      throw new NotFoundException(`Farm with ID ${id} not found`);
    }

    return model;
  }

  async update(id: string, updateFarmDto: UpdateFarmDto): Promise<Farm> {
    try {
      const model = await this.repository.rawFindOne({
        where: {
          id,
        },
        relations: ['animals'],
      });

      if (!model) throw new BadRequestException('Farm not found');

      return await this.repository.save({
        ...model,
        ...updateFarmDto,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    const model = await this.findOne(id);

    const count = await this.animalRepository.count({
      filter: {
        farmId: { eq: id },
      },
    });

    if (count > 0) {
      throw new BadRequestException(
        'Não é possível deletar a fazenda, pois existem animais vinculados a ela!',
      );
    }

    await this.repository.remove(model.id);
  }
}
