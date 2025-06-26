import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OwnerRepository } from './entities/owner.repository';
import { Owner } from './entities/owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { PageOptionsCaseInput } from 'src/common/dto/pageOptions.caseInput';

export type ListOwnersCaseSortInput = Pick<Owner, 'createdAt' | 'status'>;

@Injectable()
export class OwnersService {
  constructor(private readonly repository: OwnerRepository) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const exists = await this.repository.rawFindOne({
      where: { cpfCnpj: createOwnerDto.cpfCnpj },
    });
    if (exists) {
      throw new BadRequestException(
        'Já existe um proprietário cadastrado com este CPF/CNPJ!',
      );
    }
    return await this.repository.create(createOwnerDto);
  }

  async findAll({
    filter,
    pageNumber = 1,
    pageSize = 10,
    sort = { createdAt: 'DESC' },
  }: PageOptionsCaseInput<ListOwnersCaseSortInput>): Promise<
    PaginatedEntityResponse<Owner>
  > {
    const [data, count] = await this.repository.findMany({
      filter,
      skip: (pageNumber - 1) * pageSize,
      sort,
      take: pageSize,
    });

    return new PaginatedEntityResponse(data, count, pageSize);
  }

  async findOne(id: string): Promise<Owner> {
    const owner = await this.repository.rawFindOne({
      where: { id },
      withDeleted: true,
    });
    if (!owner) {
      throw new NotFoundException(`Owner with ID ${id} not found`);
    }
    return owner;
  }

  async update(id: string, updateOwnerDto: Partial<Owner>): Promise<Owner> {
    const owner = await this.repository.rawFindOne({
      where: { id },
    });
    if (!owner) {
      throw new BadRequestException('Owner not found');
    }

    if (updateOwnerDto.cpfCnpj && updateOwnerDto.cpfCnpj !== owner.cpfCnpj) {
      const exists = await this.repository.rawFindOne({
        where: { cpfCnpj: updateOwnerDto.cpfCnpj },
      });
      if (exists) {
        throw new BadRequestException('New CPF/CNPJ already exists');
      }
    }

    return await this.repository.save({
      ...owner,
      ...updateOwnerDto,
    });
  }

  async activate(id: string): Promise<Owner> {
    const owner = await this.findOne(id);
    if (owner.status) {
      throw new BadRequestException('Owner is already active');
    }
    return await this.repository.save({
      ...owner,
      status: true,
    });
  }

  async deactivate(id: string): Promise<Owner> {
    const owner = await this.findOne(id);
    if (!owner.status) {
      throw new BadRequestException('Owner is already inactive');
    }
    return await this.repository.save({
      ...owner,
      status: false,
    });
  }

  async remove(id: string): Promise<void> {
    const owner = await this.findOne(id);
    if (owner.deletedAt) {
      throw new BadRequestException('Owner is already deleted');
    }
    await this.repository.softDelete(id);
  }
}
