import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { AnimalsService } from './animals.service';
import { Animal } from './entities/animal.entity';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';
import { TenantInterceptor } from 'src/tenant/tenant.interceptor';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@UseInterceptors(TenantInterceptor)
@Controller('animals')
export class AnimalsController {
  constructor(private readonly service: AnimalsService) {}

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Post()
  create(
    @Body() createAnimalDto: CreateAnimalDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    createAnimalDto.companyId = activeUser.companyId;

    return this.service.create(createAnimalDto);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<Animal>,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.service.findAll(
      {
        pageNumber,
        pageSize,
        sort: parseSortQueryParam(sort),
        filter,
      },
      activeUser,
    );
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Animal> {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.service.update(id, updateAnimalDto);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.service.activate(id);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Patch(':id/inactivate')
  inactivate(@Param('id') id: string) {
    return this.service.inactivate(id);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
