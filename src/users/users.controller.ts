/* eslint-disable @typescript-eslint/no-unused-vars */
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
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from 'src/common/dto/pageOptions.dto';
import { parseSortQueryParam } from 'src/utils/parseSortQueryParam';
import { Profiles } from '../iam/authorization/decorators/profiles.decorator';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { TenantInterceptor } from '../tenant/tenant.interceptor';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Profile } from './enums/profile.enum';
import { UsersService } from './users.service';

type ActiveUser = {
  sub: string;
  email: string;
  profile: string;
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
  @Profiles(Profile.ADMIN)
  @Post('create-admin')
  createAdmin(
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
    return this.usersService.createAdmin(activeUser, createUserDto, file);
  }

  @Post('create-requester')
  @Profiles(Profile.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  createRequester(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() createUserDto: CreateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png)$/ }),
        ],
        fileIsRequired: false,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return this.usersService.createRequester(activeUser, createUserDto, file);
  }

  @Profiles(Profile.ADMIN)
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

  @Profiles(Profile.ADMIN)
  @Get('/me')
  me(@ActiveUser() activeUser: ActiveUser) {
    return {
      id: activeUser.sub,
      email: activeUser.email,
      profile: activeUser.profile,
    };
  }

  @Profiles(Profile.ADMIN)
  @Get(':id')
  findOne(@ActiveUser() activeUser: ActiveUserData, @Param('id') id: string) {
    return this.usersService.findOne(activeUser, id);
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
  @Patch('/update-password')
  updatePassword(
    @ActiveUser() activeUser: ActiveUserData,
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
  ) {
    return this.usersService.updatePassword(activeUser, updateUserPasswordDto);
  }

  @Profiles(Profile.ADMIN, Profile.REQUISITANTE)
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

  @Profiles(Profile.ADMIN)
  @Patch(':id/activate')
  activate(@Param('id') id: string, @ActiveUser() activeUser: ActiveUserData) {
    return this.usersService.activate(id, activeUser);
  }

  @Profiles(Profile.ADMIN)
  @Patch(':id/deactivate')
  deactivate(
    @Param('id') id: string,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    return this.usersService.deactivate(id, activeUser);
  }

  @Profiles(Profile.ADMIN)
  @Delete('/admin/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
