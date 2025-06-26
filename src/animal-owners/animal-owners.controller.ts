import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AnimalOwnersService } from './animal-owners.service';
import { CreateAnimalOwnerDto } from './dto/create-animal-owner.dto';
import { UpdateAnimalOwnerDto } from './dto/update-animal-owner.dto';

@Controller('animals/:animalId/owners')
export class AnimalOwnersController {
  constructor(private readonly service: AnimalOwnersService) {}
  @Post()
  create(@Body() dto: CreateAnimalOwnerDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnimalOwnerDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
