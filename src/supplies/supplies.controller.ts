import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SuppliesService } from './supplies.service';
import { CreateSupplyDto } from './dto/create-supply.dto';
import { UpdateSupplyDto } from './dto/update-supply.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { Supply } from './entities/supply.entity';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';

@Controller('supplies')
export class SuppliesController {
  constructor(private readonly suppliesService: SuppliesService) {}

  @Post()
  create(@Body() createSupplyDto: CreateSupplyDto): Promise<Supply> {
    return this.suppliesService.create(createSupplyDto);
  }

  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<Supply>,
  ): Promise<PaginatedEntityResponse<Supply>> {
    return this.suppliesService.findAll({
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supply> {
    return this.suppliesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplyDto: UpdateSupplyDto,
  ): Promise<Supply> {
    return this.suppliesService.update(id, updateSupplyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.suppliesService.remove(id);
  }
}
