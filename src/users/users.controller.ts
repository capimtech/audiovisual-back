import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { TenantInterceptor } from '../tenant/tenant.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Role } from './enums/role.enum';
import { UsersService } from './users.service';

type ActiveUser = {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  companyId: string;
};

@UseInterceptors(TenantInterceptor)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Roles(Role.ADMIN)
  @Post()
  create(
    @Body() createUserDto: CreateUserDto,
    @ActiveUser() activeUser: ActiveUserData,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.create(activeUser, createUserDto, file);
  }

  @Roles(Role.ADMIN)
  @Get()
  findAll(
    @Query()
    { pageNumber, pageSize, sort, filter }: PageOptionsDto<User>,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.usersService.findAll({
      pageNumber,
      pageSize,
      sort: parseSortQueryParam(sort),
      filter: {
        ...filter,
        companyId: { eq: activeUser?.companyId },
      },
    });
  }

  @Roles(Role.ADMIN, Role.CASEIRO)
  @Get('/me')
  me(@ActiveUser() activeUser: ActiveUser) {
    return {
      id: activeUser.sub,
      email: activeUser.email,
      role: activeUser.role,
    };
  }

  @Get(':id')
  findOne(@ActiveUser() activeUser: ActiveUserData, @Param('id') id: string) {
    return this.usersService.findOne(activeUser, id);
  }

  @Patch('/update-password')
  updatePassword(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(activeUser, updateUserPasswordDto);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch(':id')
  update(
    @ActiveUser() activeUser: ActiveUserData,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png)$/,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.usersService.update(activeUser, id, updateUserDto, file);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @ActiveUser() activeUser: ActiveUserData) {
    return this.usersService.activate(id, activeUser);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/deactivate')
  deactivate(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.usersService.deactivate(id, activeUser);
  }

  @Roles(Role.ADMIN)
  @Delete('/admin/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
