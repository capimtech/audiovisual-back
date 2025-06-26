import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { AnimalServicesService } from './animal-services.service';
import { CreateAnimalServiceDto } from './dto/create-animal-service.dto';
import { UpdateAnimalServiceDto } from './dto/update-animal-service.dto';
import { AnimalService } from './entities/animal-service.entity';
import { PageOptionsDto } from '../common/dto/pageOptions.dto';
import { parseSortQueryParam } from '../utils/parseSortQueryParam';

@Controller('animal-services')
export class AnimalServicesController {
  constructor(private readonly service: AnimalServicesService) {}

  @Post()
  create(@Body() dto: CreateAnimalServiceDto) {
    return this.service.create(dto);
  }

  @Get('animal/:animalId')
  findAllByAnimal(
    @Param('animalId') animalId: string,
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<AnimalService>,
  ) {
    return this.service.findAllByAnimal(animalId, {
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter,
    });
  }

  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<AnimalService>,
  ) {
    return this.service.findAll({
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnimalServiceDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
