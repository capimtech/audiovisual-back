import { IsEnum, IsString } from 'class-validator';
import { Role } from '../enums/role.enum';

export class UpdateAdminUserDto {
  @IsString()
  name: string;

  @IsEnum(Role)
  role: Role;

  @IsString()
  status: string;
}
