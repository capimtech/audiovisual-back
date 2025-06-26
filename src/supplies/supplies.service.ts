import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { Supply } from './entities/supply.entity';
import { SupplyRepository } from './entities/supply.repository';
import { PageOptionsCaseInput } from 'src/common/dto/pageOptions.caseInput';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';

export type ListSuppliesCaseSortInput = Pick<
  Supply,
  'id' | 'createdAt' | 'status'
>;

@Injectable()
export class SuppliesService {
  constructor(
    @Inject(SupplyRepository)
    private readonly repository: SupplyRepository,
  ) {}

  async create(createSupplyDto: CreateSupplyDto): Promise<Supply> {
    return await this.repository.create(createSupplyDto);
  }

  async findAll({
    filter,
    pageNumber = 1,
    pageSize = 10,
    sort = { createdAt: 'DESC' },
  }: PageOptionsCaseInput<ListSuppliesCaseSortInput>): Promise<
    PaginatedEntityResponse<Supply>
  > {
    const [data, count] = await this.repository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
    });

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(id: string): Promise<Supply> {
    const supply = await this.repository.rawFindOne({
      where: { id },
      withDeleted: true,
    });

    if (!supply) {
      throw new BadRequestException(`Insumo com o ID ${id} não encontrado!`);
    }
    return supply;
  }

  async update(id: string, updateSupplyDto: UpdateSupplyDto): Promise<Supply> {
    const supply = await this.findOne(id);
    if (!supply) throw new BadRequestException('Insumo não encontrado!');

    return await this.repository.save({
      ...supply,
      ...updateSupplyDto,
    });
  }

  async remove(id: string): Promise<void> {
    const supply = await this.findOne(id);
    await this.repository.softDelete(supply.id);
  }
}
