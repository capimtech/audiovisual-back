import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { CompanyRepository } from './entities/company.repository';

@Injectable()
export class CompaniesService {
  constructor(
    @Inject(CompanyRepository)
    private readonly companyRepository: CompanyRepository,
  ) {}

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return await this.companyRepository.create(createCompanyDto);
  }

  async findAll(): Promise<Company[]> {
    const [data] = await this.companyRepository.findMany({
      filter: {},
    });

    return data;
  }

  async findOne(id: string): Promise<Company> {
    const company = await this.companyRepository.rawFindOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    try {
      const company = await this.companyRepository.rawFindOne({
        where: {
          id,
        },
      });

      if (!company) throw new BadRequestException('Company not found');

      return await this.companyRepository.save({
        ...company,
        ...updateCompanyDto,
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async remove(id: string): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepository.remove(company.id);
  }
}
