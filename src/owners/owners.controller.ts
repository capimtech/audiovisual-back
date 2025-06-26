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
import { OwnersService } from './owners.service';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { Owner } from './entities/owner.entity';
import { PaginatedEntityResponse } from 'src/common/presentation/paginatedEntity.response';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';

@Controller('owners')
export class OwnersController {
  constructor(private readonly ownersService: OwnersService) {}

  @Post()
  create(@Body() createOwnerDto: CreateOwnerDto): Promise<Owner> {
    return this.ownersService.create(createOwnerDto);
  }

  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<Owner>,
  ): Promise<PaginatedEntityResponse<Owner>> {
    return this.ownersService.findAll({
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Owner> {
    return this.ownersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateOwnerDto: Partial<Owner>,
  ): Promise<Owner> {
    return this.ownersService.update(id, updateOwnerDto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string): Promise<Owner> {
    return this.ownersService.activate(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string): Promise<Owner> {
    return this.ownersService.deactivate(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.ownersService.remove(id);
  }
}
