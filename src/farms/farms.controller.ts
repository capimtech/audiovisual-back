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
import { FarmsService } from './farms.service';
import { Farm } from './entities/farm.entity';
import { CreateFarmDto } from './dto/create-farm.dto';
import { UpdateFarmDto } from './dto/update-farm.dto';
import { ActiveUserData } from 'src/iam/interfaces/active-user-data.interface';
import { ActiveUser } from 'src/iam/decorators/active-user.decorator';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';
import { TenantInterceptor } from 'src/tenant/tenant.interceptor';
import { Roles } from 'src/iam/authorization/decorators/roles.decorator';
import { Role } from 'src/users/enums/role.enum';

@UseInterceptors(TenantInterceptor)
@Controller('farms')
export class FarmsController {
  constructor(private readonly service: FarmsService) {}

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Post()
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.service.create(createFarmDto);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<Farm>,
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
  findOne(@Param('id') id: string): Promise<Farm> {
    return this.service.findOne(id);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.service.update(id, updateFarmDto);
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
