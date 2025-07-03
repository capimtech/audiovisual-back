import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { FilmRequestsService } from './film-requests.service';
import { CreateFilmRequestDto } from './dto/create-film-request.dto';
import { UpdateFilmRequestDto } from './dto/update-film-request.dto';
import { FilmRequest } from './entities/film-request.entity';
import { PageOptionsDto } from './../common/dto/pageOptions.dto';
import { parseSortQueryParam } from './../utils/parseSortQueryParam';
import { Profiles } from './../iam/authorization/decorators/profiles.decorator';
import { Profile } from './../users/enums/profile.enum';

@Controller('film-requests')
export class FilmRequestsController {
  constructor(private readonly service: FilmRequestsService) {}

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Post()
  create(@Body() createFilmRequestDto: CreateFilmRequestDto) {
    return this.service.create(createFilmRequestDto);
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<FilmRequest>,
  ) {
    return this.service.findAll({
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter,
    });
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<FilmRequest> {
    return this.service.findOne(id);
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFilmRequestDto: UpdateFilmRequestDto,
  ) {
    return this.service.update(id, updateFilmRequestDto);
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
